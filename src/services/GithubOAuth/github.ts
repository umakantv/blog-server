import axios from "axios";
import config from "../../config";

export default class GithubService {
  static async getAccessToken(code: string) {
    try {
      let clientId = config.GITHUB_OAUTH_CLIENT_ID;
      let clientSecret = config.GITHUB_OAUTH_CLIENT_SECRET;

      let url = `https://github.com/login/oauth/access_token`;

      let response = await axios.post(url, null, {
        params: {
          client_id: clientId,
          client_secret: clientSecret,
          code: code,
        },
      });

      const result = new URLSearchParams(response.data);

      if (result.get("error")) {
        throw new Error(
          "Failed to get access token: " + result.get("error_description")
        );
      }

      return result.get("access_token");
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  static async getUser(code: string) {
    try {
      const token = await this.getAccessToken(code);

      let url = "https://api.github.com/user";

      let response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    } catch (err) {
      console.error(err.message);
      throw err;
    }
  }
}
