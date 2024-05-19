export class JwtService {
  sign(payload: any): string {
    return "mocked-jwt-token";
  }

  verify(token: string): any {
    if (token === "mocked-jwt-token") {
      return { id: "test-user" }; // Mocked user payload
    } else {
      throw new Error("Invalid JWT token");
    }
  }
}
