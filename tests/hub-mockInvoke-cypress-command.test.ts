import { describe, expect, test, vi } from "vitest";
import { hubMockClearInvokes, hubMockClearSends, hubMockInvoke, hubUnmockInvoke, hubVerifyInvokes, hubVerifySends, useCypressSignalRMock } from "../src";

describe("cy.hubMockInvoke() method", () => {
  test("Should return mocked response when Invoke() is called", async () => {
    vi.stubGlobal("Cypress", {});

    const connection = useCypressSignalRMock("testHub");
    hubMockInvoke("testHub", "test", "Hello World!");
    const invokeResult = await connection!.invoke("test");

    expect(invokeResult).toBe("Hello World!");
  });
});

describe("cy.hubUnmockInvoke() method", () => {
  test("Should return unmocked response when Invoke() is called", async () => {
    vi.stubGlobal("Cypress", {});

    const connection = useCypressSignalRMock("testHub2");
    hubMockInvoke("testHub2", "test", "Hello World!");
    const invokeResult = await connection!.invoke("test");
    const invokeResult2 = await connection!.invoke("test");

    
    hubUnmockInvoke("testHub2", "test");
    const invokeResult3 = await connection!.invoke("test");

    expect(invokeResult).toBe("Hello World!");
    expect(invokeResult2).toBe("Hello World!");
    expect(invokeResult3).toBe(0);
  });
});



describe("cy.hubVerify[Invokes/Sends]() method", () => {

  test("Should verify that invoke was called with correct parameters", () => {
    vi.stubGlobal("Cypress", {});
    const hubName = "testHubInvokes";
    const hubConnection = useCypressSignalRMock(hubName, {
      enableForVitest: false,
    });

    hubConnection!.invoke("invokeMethod", 1, 2, 3);

    hubVerifyInvokes(hubName, "invokeMethod", (invokes) => {
      expect(invokes.length).toBe(1);
      expect(invokes[0].args).toEqual([1, 2, 3]);
    });

    hubConnection!.invoke("invokeMethod2", 4, 5, 6);
      hubVerifyInvokes(hubName, "invokeMethod2", (invokes) => {
      expect(invokes.length).toBe(1);
      expect(invokes[0].args).toEqual([4, 5, 6]);
    });

    hubConnection!.invoke("invokeMethod", 3, 2, 1);

    hubVerifyInvokes(hubName, "invokeMethod", (invokes) => {
      expect(invokes.length).toBe(2);
      expect(invokes[0].args).toEqual([1, 2, 3]);
      expect(invokes[1].args).toEqual([3, 2, 1]);
    });
    
    hubMockClearInvokes(hubName, "invokeMethod");

    hubVerifyInvokes(hubName, "invokeMethod", (invokes) => {
      expect(invokes.length).toBe(0);
    });

    hubVerifyInvokes(hubName, "invokeMethod2", (invokes) => {
      expect(invokes.length).toBe(1);
    });

    hubMockClearInvokes(hubName);
    hubVerifyInvokes(hubName, "invokeMethod", (invokes) => {
      expect(invokes.length).toBe(0);
    });

    hubVerifyInvokes(hubName, "invokeMethod2", (invokes) => {
      expect(invokes.length).toBe(0);
    });
  });

  test("Should verify that send was called with correct parameters", () => {
    vi.stubGlobal("Cypress", {});
    const hubName = "testHubSends";
    const hubConnection = useCypressSignalRMock(hubName, {
      enableForVitest: false,
    });

    hubConnection!.send("sendMethod", "Test");
    hubVerifySends(hubName, "sendMethod", (sends) => {
      expect(sends.length).toBe(1);
      expect(sends[0].args).toEqual(["Test"]);
    });

    hubConnection!.send("sendMethod2", 4, 5, 6);
      hubVerifySends(hubName, "sendMethod2", (sends) => {
      expect(sends.length).toBe(1);
      expect(sends[0].args).toEqual([4, 5, 6]);
    });

    hubConnection!.send("sendMethod", 3, 2, 1);
    hubVerifySends(hubName, "sendMethod", (sends) => {
      expect(sends.length).toBe(2);
      expect(sends[0].args).toEqual(["Test"]);
      expect(sends[1].args).toEqual([3, 2, 1]);
    });
    
    hubMockClearSends(hubName, "sendMethod");
    hubVerifySends(hubName, "sendMethod", (sends) => {
      expect(sends.length).toBe(0);
    });
    hubVerifySends(hubName, "sendMethod2", (sends) => {
      expect(sends.length).toBe(1);
    });

    hubMockClearSends(hubName);
    hubVerifySends(hubName, "sendMethod", (sends) => {
      expect(sends.length).toBe(0);
    });

    hubVerifySends(hubName, "sendMethod2", (sends) => {
      expect(sends.length).toBe(0);
    });
  });
});