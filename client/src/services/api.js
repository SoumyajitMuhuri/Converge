const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000"
).replace(/\/+$/, "");

function getToken() {
  return localStorage.getItem("token");
}

async function request(endpoint, options = {}) {
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  let response;

  try {
        response = await fetch(`${API_BASE_URL}${endpoint}`,
          {...options,headers,});
  } catch (error) {
    throw new Error(
      "Unable to connect to the server. Check that the server is active.",
    );
  }

  const contentType=response.headers.get("content-type") || "";
  const data = contentType.includes("application/json")? await response.json() : null;

  if(!response.ok){
    if(response.status === 401){
      throw new Error("Your session may have expired. Please log-in again");
    }

    throw new Error(
      data?.message || data?.error || `Request failed with status ${response.status}.`,
    );
  }

  return data;
}

export const api = {
register(credentials){
  return request("/api/auth/register",{
    method: "POST",
    body: JSON.stringify(credentials),
  });
},

login(credentials){
  return request("/api/auth/login",{
    method: "POST",
    body: JSON.stringify(credentials),
  });
},

getLinks(){
  return request("/api/links");
},

createLink(linkData){
  return request("/api/links",{
    method: "POST",
    body:JSON.stringify(linkData),
  });
},

deleteLink(id){
  return request(`/api/links/${encodeURIComponent(id)}`,{
    method:"DELETE",
  });
},

getDashboardAnalytics(){
  return request("/api/analytics/dashboard");
},

getLinkAnalytics(id){
  return request(`/api/analytics/${encodeURIComponent(id)}`);
},
};
