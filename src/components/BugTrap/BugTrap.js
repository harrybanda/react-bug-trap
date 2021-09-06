import "bulma/css/bulma.min.css";
import React, { Component } from "react";

export class BugTrap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false, //set to false when publishing true when testing
      modalState: true,
      name: "",
      email: "",
      report: "",
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
    alert(
      "A data was submitted: " +
        this.state.name +
        this.state.email +
        this.state.report
    );
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
    console.log(error);
    console.log(errorInfo);
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
                  class="textarea"
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
