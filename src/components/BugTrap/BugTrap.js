import "bulma/css/bulma.min.css";
import React, { Component } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import {
  browserName,
  browserVersion,
  osName,
  osVersion,
} from "react-device-detect";
import moment from "moment";
import StackTrace from "stacktrace-js";
import axios from "axios";
import PropTypes from "prop-types";
import getUuidByString from "uuid-by-string";
import { v4 as uuidv4 } from "uuid";

export class BugTrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false, //set to false when publishing true when testing
      modalState: true,
      name: "",
      email: "",
      report: "",
      errorData: {
        errorGroupId: "",
        errorId: "",
        userId: "",
        fullErrorMessage: "",
        errorName: "",
        errorMessage: "",
        browserName: "",
        browserVersion: "",
        osName: "",
        osVersion: "",
        url: "",
        date: "",
        fileInfo: "",
      },
    };
    this.toggleModal = this.toggleModal.bind(this);
    this.handleChangeName = this.handleChangeName.bind(this);
    this.handleChangeEmail = this.handleChangeEmail.bind(this);
    this.handleChangeReport = this.handleChangeReport.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChangeName(event) {
    this.setState({
      name: event.target.value,
    });
  }

  handleChangeEmail(event) {
    this.setState({
      email: event.target.value,
    });
  }

  handleChangeReport(event) {
    this.setState({
      report: event.target.value,
    });
  }

  handleSubmit(event) {
    axios.post(this.props.webhook, {
      feedback: {
        name: this.state.name,
        email: this.state.email,
        report: this.state.report,
        errorGroupId: this.errorData.errorGroupId,
        errorId: this.state.errorData.errorId,
      },
    });
    event.preventDefault();
    this.toggleModal();
  }

  toggleModal() {
    this.setState((prev, props) => {
      const newState = !prev.modalState;
      return { modalState: newState };
    });
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    var errorData = { ...this.state.errorData };

    const fpPromise = FingerprintJS.load();
    (async () => {
      const fp = await fpPromise;
      const result = await fp.get();
      const visitorId = result.visitorId;

      errorData.userId = visitorId;
      errorData.fullErrorMessage = error.toString();
      errorData.errorMessage = error.message;
      errorData.errorName = error.name;
      errorData.browserName = browserName;
      errorData.browserVersion = browserVersion;
      errorData.osName = osName;
      errorData.osVersion = osVersion;
      errorData.url = window.location.href;
      errorData.date = moment().format();
      errorData.errorGroupId = "error_group_" + getUuidByString(error.message);
      errorData.errorId = "error_id_" + uuidv4();

      StackTrace.fromError(error).then((err) => {
        errorData.fileInfo = JSON.stringify(err[0]);
        this.setState({ errorData });
        axios.post(this.props.webhook, {
          errorData: this.state.errorData,
        });
      });
    })();
  }

  render() {
    if (this.state.hasError) {
      return (
        <Modal
          closeModal={this.toggleModal}
          modalState={this.state.modalState}
          title="User Feedback"
        >
          <p>
            Our team has been notified about the error if you would like to
            help, tell us what happened below.
          </p>
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="name"
                  placeholder="Name"
                  required
                  value={this.state.name}
                  onChange={this.handleChangeName}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input
                  className="input"
                  type="email"
                  placeholder="Email"
                  required
                  value={this.state.email}
                  onChange={this.handleChangeEmail}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <textarea
                  className="textarea"
                  placeholder="I clicked on 'X'"
                  value={this.state.report}
                  onChange={this.handleChangeReport}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <button className="button is-info is-fullwidth">
                  Submit Crash Report
                </button>
              </p>
              <p className="control">
                <button
                  className="button is-fullwidth"
                  onClick={this.toggleModal}
                >
                  Close
                </button>
              </p>
            </div>
          </form>
        </Modal>
      );
    }
    return this.props.children;
  }
}

const Modal = ({ children, closeModal, modalState, title }) => {
  if (!modalState) {
    return null;
  }
  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <section className="modal-card-body">
          <div className="modal-card-title">{title}</div>
          <br />
          <div className="content">{children}</div>
        </section>
      </div>
    </div>
  );
};

BugTrap.propTypes = {
  webhook: PropTypes.string.isRequired,
};
