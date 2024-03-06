import {CallableOptions, HttpsError, onCall} from "firebase-functions/v2/https";
import {setGlobalOptions} from "firebase-functions/v2/options";

setGlobalOptions({region: "europe-west1"});

interface AuthOptions extends CallableOptions {
  allowUnauthenticated?: boolean
}

const validateAuth = (auth: any | undefined, extraData: any = {}) => {
  if (!auth) {
    throw new HttpsError(
      "unauthenticated",
      "The function must be called while authenticated.",
      extraData
    );
  }
};

const onCallAuth = (handler: (...args: any[]) => any, options?: AuthOptions) =>
  onCall(
    {
      ...options,
    },
    (req) => {
      const data = req.data;
      const auth = req.auth;
      const {rawRequest} = req;
      if (!auth?.uid && !options?.allowUnauthenticated) {
        validateAuth(auth, req);
        throw new HttpsError(
          "unauthenticated",
          "The function must be called while authenticated.",
          {data, auth, rawRequest}
        );
      }
      return handler(data, auth, rawRequest);
    }
  );

export default onCallAuth;
