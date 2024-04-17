import {Injectable} from '@angular/core';
import {CartService} from '../_services/cart.service';
import {payments} from 'remote-pay-cloud-api';
import DataEntryLocation = payments.DataEntryLocation;
import {response, constructor} from 'express';
import { first } from "rxjs/operators";
import {ViewCartComponent} from '../view-cart/view-cart.component';
import { ActivatedRoute, Router } from "@angular/router";
import * as _ from 'lodash';
import {User} from '../_models';
import { NotifierService } from "angular-notifier";
import {CloverOrderService} from '../_services/cloverOrder.service';
import {AlertService} from '../_services';
import {CloverApiService} from '../_services/cloverApi.service';
import {CloverOrder} from '../_models/cloverOrder';
import * as clover from 'remote-pay-cloud';
import {paymentReceiptComponent} from '../payment-receipt/payment-receipt.component';
import {injectArgs} from '@angular/core/src/di/injector_compatibility';
import {WebSocketListener} from 'remote-pay-cloud/src/com/clover/websocket/WebSocketListener';


@Injectable()
export class ccAuth {


  constructor() {
    console.log('ccAuth Constructor');
  }

  private cloverDeviceConnectionConfiguration;
  private cloverConnector: clover.remotepay.ICloverConnector = null;
  private cloverSale: clover.remotepay.SaleRequest = null;
  private authToken: string = null;
  private cartService: CartService;
  private totalDue: number;
  private tipAmount: number;
  paymentReceipt: paymentReceiptComponent;












  /**
   * Establishes a connection to the Clover device based on the configuration provided.
   */
  connect(connectionConfiguration: any = null): void {
    console.log("ccAuth Connection initialized")
    this.cleanup(); // any existing connections.
    connectionConfiguration = this.buildConnectionConfig();

    clover.DebugConfig.loggingEnabled = true;
    let cloverDeviceConnectionConfiguration: clover.CloverDeviceConfiguration = null;
    console.log("Attempting to connect to your Clover device, please wait  ....");
    cloverDeviceConnectionConfiguration = this.getDeviceConfigurationForCloud(connectionConfiguration);
    console.log("cloverDeviceConnectionConfiguration: " + cloverDeviceConnectionConfiguration);

    let builderConfiguration: any = {};
    builderConfiguration[clover.CloverConnectorFactoryBuilder.FACTORY_VERSION] = clover.CloverConnectorFactoryBuilder.VERSION_12;
    let cloverConnectorFactory: clover.CloverConnectorFactory = clover.CloverConnectorFactoryBuilder.createICloverConnectorFactory(builderConfiguration);
    this.cloverConnector = cloverConnectorFactory.createICloverConnector(cloverDeviceConnectionConfiguration);
    // Work-around for typings issue in 3.1.0.  This will be fixed in the next release.
    (this.cloverConnector as any).addCloverConnectorListener(this.buildCloverConnectionListener());
    this.cloverConnector.initializeConnection();
    console.log("ccAuth connection succeeded");

  }

  /**
   * Sends a message to your Clover device.
   */
  showMessage(): void {
    this.cloverConnector.showMessage("Welcome to Clover Connector!");
    // NOTE:  We are NOT returning the device to the default screen!  Because we are not,
    // the message will remain on the device until it is told to change it.
  }

  /**
   * Resets your Clover device (will cancel ongoing transactions and return to the welcome screen).
   */
  resetDevice(): void {
    this.cloverConnector.resetDevice();
  }

  /**
   * Performs a sale on your Clover device.
   */
  performSale() {
    var saleRequest: clover.remotepay.SaleRequest = new clover.remotepay.SaleRequest();
    saleRequest.setExternalId(clover.CloverID.getNewId());
    saleRequest.setAmount(this.totalDue);
    saleRequest.setTipAmount(this.tipAmount);
    console.log("Total Amount Due: " + this.totalDue);
    saleRequest.setAutoAcceptSignature(true);
    saleRequest.setAutoAcceptPaymentConfirmations(true);
    saleRequest.setDisableDuplicateChecking(true); // allows same card to be used more than once
    saleRequest.setDisableReceiptSelection(true);
    saleRequest.setDisableCashback(true);
    saleRequest.setSignatureEntryLocation(DataEntryLocation.NONE);

    console.log({message: "Sending sale: ", request: saleRequest});
    // Perform the sale.
    this.cloverConnector.sale(saleRequest);
  }

  /**
   * It is important to properly dispose of your Clover Connector, this function is called in window.onbeforeunload in index.html.
   */
  cleanup(): void {
    if (this.cloverConnector) {
      this.cloverConnector.dispose();
      //this.toggleElement("actions", false);
      this.updateStatus("Not connected to your Clover device.  Please refresh the page to re-connect and perform an action.");
    }
  }

  showNetworkInfo(): void {
    //this.toggleElement("networkInfo", true);
    //this.toggleElement("cloudInfo", false);
  }

  showCloudInfo(): void {
    //this.toggleElement("cloudInfo", true);
    //this.toggleElement("networkInfo", false);
  }


  /**
   * Builds a configuration container from the web form.
   */
  buildConnectionConfig(): any {
    const config: any = {};
    if (this.isCloudConfig()) {
      config["applicationId"] = 'PVZY6TBHX5JSE.7HPEPVBTZGDCP';
      config["accessToken"] = (localStorage.getItem("clover_access_token"));
      config["cloverServer"] = 'https://sandbox.dev.clover.com'; //Change when going in production
      config["merchantId"] = (localStorage.getItem("merchant_id"));
      config["deviceId"] = 'e5fcd724-99d5-f427-886a-4b604b952684';
      config["friendlyId"] = 'Clover_Device_1';
    } else { //else statement shoud not be used if using cloud connection
      config["applicationId"] = (document.getElementById("snpdAppId") as HTMLInputElement).value;
      config["endpoint"] = (document.getElementById("endpoint") as HTMLInputElement).value;
      config["posName"] = (document.getElementById("posName") as HTMLInputElement).value;
      config["serialNumber"] = (document.getElementById("serialNumber") as HTMLInputElement).value;
      config["authToken"] = this.authToken;
    }
    return config;
  }

  isCloudConfig(): boolean {
    //const cloudInfo = document.getElementById("cloudInfo");
    //console.log('cloudInfo: ' + document.getElementById('cloudInfo'));
    return true;//cloudInfo && cloudInfo.style.display === "block";                //always returns true (beta)
  }

  /**
   * Build and return the connection configuration object for cloud.
   *
   * @param connectionConfiguration
   * @returns {WebSocketCloudCloverDeviceConfiguration}
   */
  getDeviceConfigurationForCloud(connectionConfiguration: any): clover.CloverDeviceConfiguration {
    // Work-around for typings issue in 3.1.0.  This will be fixed in the next release.
    const configBuilder: any = new (clover as any).WebSocketCloudCloverDeviceConfigurationBuilder(connectionConfiguration.applicationId,
      connectionConfiguration.deviceId, connectionConfiguration.merchantId, connectionConfiguration.accessToken);
    configBuilder.setCloverServer(connectionConfiguration.cloverServer);
    configBuilder.setFriendlyId(connectionConfiguration.friendlyId);
    configBuilder.setHeartbeatInterval(1000);
    return configBuilder.build();
  }

  /**
   * Build and return the connection configuration object for network. When initially connecting to Secure Network
   * Pay Display pairing is required.  The configuration object provides callbacks so the application can
   * handle the pairing however it chooses.  In this case we update a UI element on the web page with the
   * pairing code that must be entered on the device to establish the connection.  The authToken returned
   * in onPairingSuccess can be saved and used later to avoid pairing for subsequent connection attempts.
   *
   * @param connectionConfiguration
   * @returns {WebSocketPairedCloverDeviceConfiguration}
   */
  getDeviceConfigurationForNetwork(connectionConfiguration: any): clover.CloverDeviceConfiguration {
    const onPairingCode = (pairingCode) => {
      const pairingCodeMessage = `Please enter pairing code ${pairingCode} on the device`;
      this.updateStatus(pairingCodeMessage, true);
      console.log(`    >  ${pairingCodeMessage}`);
    };
    const onPairingSuccess = (authTokenFromPairing) => {
      console.log(`    > Got Pairing Auth Token: ${authTokenFromPairing}`);
      this.authToken = authTokenFromPairing;
    };

    // Work-around for typings issue in 3.1.0.  This will be fixed in the next release.
    const configBuilder: any = new (clover as any).WebSocketPairedCloverDeviceConfigurationBuilder(
      connectionConfiguration.applicationId,
      connectionConfiguration.endpoint,
      connectionConfiguration.posName,
      connectionConfiguration.serialNumber,
      connectionConfiguration.authToken,
      onPairingCode,
      onPairingSuccess);

    return configBuilder.build();
  }

  /**
   * Custom implementation of ICloverConnector listener, handles responses from the Clover device.
   */
  buildCloverConnectionListener() {


      return Object.assign({}, clover.remotepay.ICloverConnectorListener.prototype, {
        onPrintResponse: function (response: clover.remotepay.PrintRequest): void {
          console.log({message: "Print Sent", response: response});
        },

        onSaleResponse: function (response: clover.remotepay.SaleResponse): void {
          let result = '';
          //this.updateStatus("Sale complete.", response.getResult() === "SUCCESS");
          console.log({message: "Sale response received", response: response});
          if (!response.getIsSale()) {
            console.log({error: "Response is not a sale!"});
            result = "Sale was unsuccessful";

          }
          if (response.getSuccess()) {
            result = "Sale was successful";

          }
          console.log(result);

        },

        // See https://docs.clover.com/build/working-with-challenges/
        onConfirmPaymentRequest: function (request: clover.remotepay.ConfirmPaymentRequest): void {
          console.log({message: "Automatically accepting payment", request: request});
          //this.updateStatus("Automatically accepting payment", true);
          this.cloverConnector.acceptPayment(request.getPayment());
          // to reject a payment, pass the payment and the challenge that was the basis for the rejection
          // getCloverConnector().rejectPayment(request.getPayment(), request.getChallenges()[REJECTED_CHALLENGE_INDEX]);
        },

        // See https://docs.clover.com/build/working-with-challenges/
        onVerifySignatureRequest: function (request: clover.remotepay.VerifySignatureRequest): void {
          console.log({message: "Automatically accepting signature", request: request});
          //this.updateStatus("Automatically accepting signature", true);
          this.cloverConnector.acceptSignature(request);
          // to reject a signature, pass the request to verify
          // getCloverConnector().rejectSignature(request);
        },

        onDeviceReady: function (merchantInfo: clover.remotepay.MerchantInfo): void {
          //this.updateStatus("Your Clover device is ready to process requests.", true);
          console.log({message: "Device Ready to process requests!", merchantInfo: merchantInfo});
          //this.toggleElement("connectionForm", false);
          //this.toggleElement("actions", true);
        },

        onDeviceError: function (cloverDeviceErrorEvent: clover.remotepay.CloverDeviceErrorEvent): void {
          //this.updateStatus(`An error has occurred and we could not connect to your Clover Device. ${cloverDeviceErrorEvent.getMessage()}`, false);
          //this.toggleElement("connectionForm", true);
          //this.toggleElement("actions", false);
        },

        onDeviceDisconnected: function (): void {
          //this.updateStatus("The connection to your Clover Device has been dropped.", false);
          console.log({message: "Disconnected"});
          //this.toggleElement("connectionForm", true);
          //this.toggleElement("actions", false);
        },

      });
  }


  toggleElement(eleId: string, show: boolean): void {
    let actionsEle: HTMLElement = document.getElementById(eleId);
    if (show) {
      actionsEle.style.display = "block";
    } else {
      actionsEle.style.display = "none";
    }
  }

  updateStatus(message: string, success: boolean = false): void {
    //this.toggleElement("statusContainer", true);
    const statusEle: HTMLElement = document.getElementById("statusMessage");
    //statusEle.innerHTML = message;
    if (success === false) {
      //statusEle.className = "alert alert-danger";
    } else if (success) {
      statusEle.className = "alert alert-success";
      alert("Payment Successful");
    } else {
      statusEle.className = "alert alert-warning";
    }
  }

  Total(total: number) {
        this.totalDue = total;
  }

  getTotal(){
    return this.totalDue;
  }

  setTipAmount(tip: number){
    this.tipAmount = tip;
  }

  paymentSuccess(): void{

    this.paymentReceipt.paymentSuccess()
  }

  paymentFailure(): void{

    this.paymentReceipt.paymentFailure();
  }

  setPrint(text: Array<string>) {

    console.log("Text: " + text);
    //console.log("printDeviceId: " + printDeviceId);
    //console.log("printRequestId: " + printRequestId);
    var printRequest: clover.remotepay.PrintRequest = new clover.remotepay.PrintRequest();
    printRequest.setText(text);
    //printRequest.setPrintDeviceId(printDeviceId);
    //printRequest.setRequestId(printRequestId);
    console.log({message: "Printing sale: ", request: printRequest});
    this.cloverConnector.print(printRequest);

  }

  cloverGetPrinters() {
    var printReturn: clover.remotepay.RetrievePrintersRequest = new clover.remotepay.RetrievePrintersRequest();
    var printers = this.cloverConnector.retrievePrinters(printReturn)
    return printers;
    //printers.forEach(printers);
  }

  listPrinters(item, index) {
    document.getElementById("printers").innerHTML += index + ":" + item + "<br>";
  }

}



