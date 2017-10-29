import React, { Component } from 'react'
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RequestView.scss';
import ApprovalPrompt from './ApprovalPrompt';
import RequestApprovalForm from './RequestApprovalForm';

const styles = {
  customWidth: {
    width: 600,
  },
};



class RequestApproval extends Component {

  constructor(props) {
    super(props);
    this.state = { visible: false };
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    this.setState({ visible: ! this.state.visible });
  }

  render() {
    console.log('requestinfo: ');
    console.log(JSON.stringify(this.props.requestInfo));
    const { value } = this.state;
    return (
      <div>
        <div>
          <table className={s.req_detail_table}>
            <tbody>
            <tr>
              <td>Date: {this.props.requestInfo.date}</td>
              <td>Department: {this.props.requestInfo.user.department}</td>
            </tr>
            <tr>
              <td>Requested By: {this.props.requestInfo.user.requestBy}</td>
              <td>SFU ID: {this.props.requestInfo.user.sfuBCID}</td>
            </tr>
            <tr>
              <td>Type/Name of Event: {this.props.requestInfo.event.nameOfEvent}</td>
              <td>Licensed: {this.props.requestInfo.user.licensed}</td>
            </tr>
            <tr>
              <td>Location of Event: {this.props.requestInfo.event.location}</td>
              <td># of Attendees: {this.props.requestInfo.event.numberOfAttendees}</td>
            </tr>
            <tr>
              <td>Event Date: {this.props.requestInfo.event.eventDates}</td>
              <td></td>
            </tr>
            <tr>
              <td>Authorized By: {this.props.requestInfo.authorizedBy}</td>
              <td>Phone: {this.props.requestInfo.authorizedPhone}</td>
            </tr>
            </tbody>
          </table>
        </div>
        {
          this.props.approved ?
            <RequestApprovalForm
              requestID={this.props.requestID}/>
              :
            <ApprovalPrompt
              requestInfo={this.props.requestInfo}
              requestID={this.props.requestID} />
        }
    </div>
    )
  }
}

export default withStyles(RequestApproval, s);
