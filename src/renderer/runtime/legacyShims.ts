import { AuthService } from "@services/auth.service";
import { OrderStore, orderHelpers } from "@services/order.service";

declare global {
  interface Window {
    __AuthServiceCtor?: typeof AuthService;
    __OrderStoreCtor?: typeof OrderStore;
    __OrderHelpers?: typeof orderHelpers;
  }
}

const registerAuthServiceShim = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.__AuthServiceCtor) {
    window.__AuthServiceCtor = AuthService;
  }
};

const registerOrderHelpersShim = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (!window.__OrderHelpers) {
    window.__OrderHelpers = orderHelpers;
  }

  if (!window.__OrderStoreCtor) {
    window.__OrderStoreCtor = OrderStore;
  }
};

registerAuthServiceShim();
registerOrderHelpersShim();

export {};
