import axios from "../../util/axios";


export async function getTokens(username, password) {
  // const {data} = await axios.post("/auth/login/", {
  //   username,
  //   password
  // });
  //
  // return {token: data.access, refreshToken: data.refresh, user: data.user};

  return {token: 'a', refreshToken: 'b', user: {id: 1, username: 'test'}};
}

export async function signup(formData, isCreator) {
  const {data} = await axios.post("/auth/registration/", formData, {
    params: {
      type: isCreator ? "creator" : undefined
    }
  });

  return data;
}

export async function currentUserInfo() {
  // const {data} = await axios.get("/auth/user/");
  //
  // return data;
  return {id: 1, username: 'test'};
}