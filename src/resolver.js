import gql from "graphql-tag";

export const THEME = { LIGHT: "#6dbad8", DARK: "#053F5C" };

// DEV
export const API_URL = "http://localhost:8000/graphql/";
export const DOMAIN_MEDIA = "http://localhost:8000/media";
export const DOMAIN_STATIC = "http://localhost:8000/static";

export const GET_STARTDATE = gql`
  query getStartDate($uid: Int) {
    startDate(userId: $uid)
  }
`;

export const GET_LOCATIONS = gql`
  query getLos($uid: Int, $search: String, $handler: String) {
    locations(userId: $uid, search: $search, handler: $handler) {
      id
      name
    }
  }
`;

export const GET_CNTRTYPES = gql`
  query getCNTRTypes($uid: Int, $search: String) {
    cntrtypes(userId: $uid, search: $search) {
      id
      name
    }
  }
`;

export const GET_QUERYPARAMS = gql`
  query {
    queryParams @client
  }
`;

export const SET_QUERYPARAMS = gql`
  mutation setQP($queryParams: String) {
    setQueryParams(queryParams: $queryParams) @client
  }
`;

export const GET_CHARTS = gql`
  query getCharts($uid: Int, $queryParams: String) {
    charts(userId: $uid, queryParams: $queryParams) {
      id
      liner {
        id
        name
      }
      buying20
      buying40
      buying4H
      effectiveDate
    }
  }
`;

export const defaults = {
  queryParams: {
    selectedPl: "",
    selectedPd: "",
    selectedTy: "",
    initialSF: "",
    initialST: ""
  }
};

export const resolvers = {
  Mutation: {
    setQueryParams: (_, variables, { cache }) => {
      cache.writeQuery({
        query: GET_QUERYPARAMS,
        data: {
          queryParams: variables.queryParams
        }
      });
      return null;
    }
  }
};
