export interface UserIDType {
    uid?: string; 
  }

export interface UserResponseType {
  user: User | null;
}
export interface User {
    uid: string;
    displayName: string;
    email: string;
    phoneNumber: string;
    photoURL: string;
    metadata: {
      creationTime: string;
      lastSignInTime: string;
    };
  }
  
  /**
   * Represents the response from the API.
   */
  export interface APIResponse {
    message: string;
    status:number
  }