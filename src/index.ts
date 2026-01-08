// load type definitions that come with Cypress module
// and then add our new commands to the "cy" object
/// <reference types="cypress" />

import { HubConnection } from "@microsoft/signalr";
import { setupCypressCommands } from "./cypress-commands";
import Log from "./log.ts";
import HubConnectionMock from "./types/HubConnectionMock";
import IMockData from "./types/IMockData";
import IServerInvoke from "./types/IServerInvoke";
import IServerSend from "./types/IServerSend.ts";
import {
  getCypressSignalrMockData,
  isCypressRunning,
  isInVitestMode,
} from "./utils.ts";

setupCypressCommands();
useCypressSignalRMock("default");

/**
 * Initializes a mock SignalR HubConnection when running in Cypress
 * or when enableForVitest is true and running in Vitest
 * @param name
 * @param debug
 * @param enableForVitest
 */
export function useCypressSignalRMock(
  name: string,
  options?: { debug?: boolean; enableForVitest?: boolean }
): HubConnection | null {
  const { debug, enableForVitest } = options ?? {};
  if (debug) {
    Log.setLogLevel(4);
  }
  if (!enableForVitest && isInVitestMode()) {
    Log.info(
      `Vitest detected. To enable CypressSignalRMock in Vitest, pass { enableForVitest: true } to useCypressSignalRMock(). Skipping...`
    );
  }

  if (isCypressRunning() || (enableForVitest && isInVitestMode())) {
    const mock = new HubConnectionMock(name);
    getCypressSignalrMockData().mocks.push(mock);
    return <HubConnection>(mock as unknown);
  }
  return null;
}

/**
 * Typings
 */
// This cannot be in a index.d.ts file otherwise it will not be loaded in by Cypress
declare global {
  interface Window {
    "cypress-signalr-mock": IMockData;
  }

  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Simulates a message sent from the Server => Client
       * @param hubName The name of the hub
       * @param messageType The name of the message type
       * @param payload The payload to send with the action
       */
      hubPublish(
        hubName: string,
        messageType: string,
        ...payload: any[]
      ): Chainable<Subject>;

      /**
       * Verifies that a message was sent from the Client => Server with the invoke() method
       * @param hubName The name of the hub
       * @param messageType The name of the message type
       * @param callback A callback function that will be called with the invokes
       */
      hubVerifyInvokes(
        hubName: string,
        messageType: string,
        callback?: (invokes: IServerInvoke[]) => void
      ): Chainable<Subject>;

      /**
       * Verifies that a message was sent from the Client => Server with the send() method
       * @param hubName The name of the hub
       * @param messageType The name of the message type
       * @param callback A callback function that will be called with the invokes
       */
      hubVerifySends(
        hubName: string,
        messageType: string,
        callback?: (invokes: IServerSend[]) => void
      ): Chainable<Subject>;

      /**
       * Clears all data from the window["cypress-signalr-mock"] object
       */
      hubClear(): Chainable<Subject>;

      /**
       * Prints the current data to console in the window["cypress-signalr-mock"] object
       */
      hubPrintData(): Chainable<Subject>;

      hubMockInvoke(hubName: string, methodName: string, payload: any): Chainable<Subject>;

      hubUnmockInvoke(hubName: string, methodName: string) : Chainable<Subject>;

      /**
       * Clears all called invokes for a specific hub. If methodName is provided, only clears invokes for that method.
       * @param hubName The name of the hub
       * @param methodName The name of the message method to clear (optional)
       */
      hubMockClearInvokes(hubName: string, methodName?: string): Chainable<Subject>;

      /**
       * Clears all called sends for a specific hub. If methodName is provided, only clears sends for that method.
       * @param hubName The name of the hub
       * @param methodName The name of the message method to clear (optional)
       */
      hubMockClearSends(hubName: string, methodName?: string): Chainable<Subject>;
    }
  }
}

export {
  hubClear,
  hubMockClearInvokes,
  hubMockClearSends,
  hubMockInvoke,
  hubPrintData,
  hubPublish,
  hubUnmockInvoke,
  hubVerifyInvokes,
  hubVerifySends
} from "./cypress-commands";

