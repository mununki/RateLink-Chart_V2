import React from "react";
import {
  GET_LOCATIONS,
  GET_CNTRTYPES,
  GET_STARTDATE,
  SET_QUERYPARAMS
} from "../resolver";
import AsyncSelect from "react-select/lib/Async";
import { Query, Mutation, withApollo } from "react-apollo";
import moment from "moment";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      queryParams: {
        selectedPl: "",
        selectedPd: "",
        selectedTy: "",
        initialSF: moment()
          .subtract(3, "months")
          .startOf("month"),
        initialST: moment().endOf("month")
      }
    };
    this._loadPols = this._loadPols.bind(this);
    this._loadPods = this._loadPods.bind(this);
    this._loadTypes = this._loadTypes.bind(this);
  }
  _handleTZ = prevData => {
    let newData = {
      ...prevData,
      initialSF: prevData.initialSF.toString(),
      initialST: prevData.initialST.toString()
    };
    return newData;
  };
  _loadPols = inputValue => {
    return this.props.client
      .query({
        query: GET_LOCATIONS,
        variables: {
          uid: this.props.USER_ID,
          search: inputValue,
          handler: "pol"
        }
      })
      .then(response => {
        let results = [];
        response.data.locations.map(lo =>
          results.push({ label: lo.name, value: lo.id })
        );
        return results;
      });
  };
  _loadPods = inputValue => {
    return this.props.client
      .query({
        query: GET_LOCATIONS,
        variables: {
          uid: this.props.USER_ID,
          search: inputValue,
          handler: "pod"
        }
      })
      .then(response => {
        let results = [];
        response.data.locations.map(lo =>
          results.push({ label: lo.name, value: lo.id })
        );
        return results;
      });
  };
  _loadTypes = inputValue => {
    return this.props.client
      .query({
        query: GET_CNTRTYPES,
        variables: {
          uid: this.props.USER_ID,
          search: inputValue
        }
      })
      .then(response => {
        let results = [];
        response.data.cntrtypes.map(ty =>
          results.push({ label: ty.name, value: ty.id })
        );
        return results;
      });
  };
  _handleChange = (data, target) => {
    this.setState({
      queryParams: {
        ...this.state.queryParams,
        [target]: data
      }
    });
  };
  render() {
    const { queryParams } = this.state;
    return (
      <div className="container-fluid">
        <div className="row m-0 px-2">
          <div className="col-12 col-sm-4 col-lg-3 px-0">
            <AsyncSelect
              name="headerPol"
              cacheOptions
              defaultOptions
              loadOptions={this._loadPols}
              openOnFocus={true}
              placeholder="POL"
              onChange={data => this._handleChange(data, "selectedPl")}
              value={queryParams.selectedPl}
              isClearable={false}
            />
          </div>
          <div className="col-12 col-sm-4 col-lg-3 px-0">
            <AsyncSelect
              name="headerPod"
              cacheOptions
              defaultOptions
              loadOptions={this._loadPods}
              openOnFocus={true}
              placeholder="POD"
              onChange={data => this._handleChange(data, "selectedPd")}
              value={queryParams.selectedPd}
              isClearable={false}
            />
          </div>
          <div className="col-12 col-sm-4 col-lg-3 px-0">
            <AsyncSelect
              name="headerType"
              cacheOptions
              defaultOptions
              loadOptions={this._loadTypes}
              openOnFocus={true}
              placeholder="TYPE"
              onChange={data => this._handleChange(data, "selectedTy")}
              value={queryParams.selectedTy}
              isClearable={false}
            />
          </div>
          <div className="col-12 col-sm-12 col-lg-3 px-0 px-sm-1">
            <div className="row m-0 px-0">
              <Query
                query={GET_STARTDATE}
                variables={{ uid: this.props.USER_ID }}
              >
                {({ loading, error, data }) => {
                  if (loading) return null;
                  if (error) return <span>Error :(</span>;

                  let result = [];

                  let currentDate = moment(data.startDate);
                  let endDate = moment().endOf("month");

                  while (currentDate.isBefore(endDate)) {
                    result.push(currentDate.format("YYYY-MM"));
                    currentDate.add(1, "month");
                  }

                  return (
                    <>
                      <div className="col px-0">
                        <select
                          name="initialSF"
                          className="form-control"
                          value={this.state.queryParams.initialSF.format(
                            "YYYY-MM"
                          )}
                          onChange={event =>
                            this._handleChange(
                              moment(event.target.value),
                              "initialSF"
                            )
                          }
                        >
                          {result.map((mon, k) => (
                            <option key={k} value={mon}>
                              {mon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col px-0">
                        <select
                          name="initialST"
                          className="form-control"
                          value={this.state.queryParams.initialST.format(
                            "YYYY-MM"
                          )}
                          onChange={event =>
                            this._handleChange(
                              moment(event.target.value).endOf("month"),
                              "initialST"
                            )
                          }
                        >
                          {result.map((mon, k) => (
                            <option key={k} value={mon}>
                              {mon}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="col-2 col-sm-3 pr-0">
                        <Mutation
                          mutation={SET_QUERYPARAMS}
                          variables={{
                            queryParams: this._handleTZ(this.state.queryParams)
                          }}
                        >
                          {setQP => (
                            <button
                              className="btn btn-primary float-right"
                              onClick={() => setQP()}
                            >
                              SEARCH
                            </button>
                          )}
                        </Mutation>
                      </div>
                    </>
                  );
                }}
              </Query>
            </div>
          </div>
          <div className="my-1">
            <mark>(Note: Average Rate of each period)</mark>
          </div>
        </div>
      </div>
    );
  }
}

export default withApollo(Header);
