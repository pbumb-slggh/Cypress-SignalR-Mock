/// <reference types="cypress" />
import Log from "./log";
import IServerInvoke from "./types/IServerInvoke";
import IServerSend from "./types/IServerSend.ts";
import {
  clearCypressSignalrMockData,
  getCypressSignalrMockData,
  getHubConnectionMock,
  isCypressRunning,
} from "./utils.ts";

export function setupCypressCommands() {
  if (!isCypressRunning()) {
    Log.debug("Cypress is not running, skipping setup of Cypress commands");
    return;
  }

  // @ts-ignore
  const cypress = window.Cypress;

  cypress.Commands.add("hubMockInvoke", hubMockInvoke);

  cypress.Commands.add("hubUnmockInvoke", hubUnmockInvoke);

  cypress.Commands.add("hubPublish", hubPublish);

  cypress.Commands.add("hubVerifyInvokes", hubVerifyInvokes);

  cypress.Commands.add("hubVerifySends", hubVerifySends);

  cypress.Commands.add("hubClear", hubClear);

  cypress.Commands.add("hubPrintData", hubPrintData);

  cypress.Commands.add("hubMockClearInvokes", hubMockClearInvokes);

  cypress.Commands.add("hubMockClearSends", hubMockClearSends);
}

export function hubMockInvoke(hubName: string, methodName: string, payload: any) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(`[cy.hubMockInvoke] - HubConnectionMock not found for ${hubName}`);
    return;
  }
  hubConnectionMock.mockInvoke(methodName, payload);
}

export function hubUnmockInvoke(hubName: string, methodName: string) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(`[cy.hubUnmockInvoke] - HubConnectionMock not found for ${hubName}`);
    return;
  }
  hubConnectionMock.unmockInvoke(methodName);
}

export function hubPublish(hubName: string, messageType: string, ...payload: any[]) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(`[cy.hubPublish] - HubConnectionMock not found for ${hubName}`);
    return;
  }
  hubConnectionMock.publish(messageType, ...payload);
}

export function hubVerifyInvokes(
  hubName: string,
  messageType: string,
  callback?: (invokes: IServerInvoke[]) => void
) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(
      `[cy.hubVerifyInvokes] - HubConnectionMock not found for hub with name: ${hubName}`
    );
    return;
  }
  hubConnectionMock.verifyInvokes(messageType, callback);
}

export function hubVerifySends(
  hubName: string,
  messageType: string,
  callback?: (invokes: IServerSend[]) => void
) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(
      `[cy.hubVerifySends] - HubConnectionMock not found for hub with name: ${hubName}`
    );
    return;
  }
  hubConnectionMock.verifySends(messageType, callback);
}

export function hubPrintData() {
  Log.info(
    'Current window["cypress-signalr-mock"] data:',
    getCypressSignalrMockData()
  );
}

export function hubClear() {
  clearCypressSignalrMockData();
}


export function hubMockClearInvokes(hubName: string, methodName?: string) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(
      `[cy.hubMockClearInvokes] - HubConnectionMock not found for hub with name: ${hubName}`
    );
    return;
  }

  hubConnectionMock.clearInvokes(methodName);
}


export function hubMockClearSends(hubName: string, methodName?: string) {
  const hubConnectionMock = getHubConnectionMock(hubName);
  if (!hubConnectionMock) {
    Log.error(
      `[cy.hubMockClearSends] - HubConnectionMock not found for hub with name: ${hubName}`
    );
    return;
  }

  hubConnectionMock.clearSends(methodName);
}