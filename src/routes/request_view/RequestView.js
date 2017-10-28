import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './RequestView.scss';
import NotFound from './NotFound';
import RequestApproval from './RequestApproval';

function ServiceView({request}) {
  console.log('Request: ' + request);
  if(request.length > 0) {
    return (
      <div className={s.root}>
        <RequestApproval requestInfo={request[0]} />
      </div>
    );
  }
  else {
    return (<NotFound />);
  }
  /*
  var rows = [];
  for(var i = 0; i < request.length; i++) {
    rows.push(<OneServiceRequest serviceRequest={
      request[i]
    }/>);
  }
  return (
    <div className={s.root}>
      <div className={s.container}>
        <h1 className={s.title}>Service View</h1>
        <table className={s.service_request_table}>
          <tr>
            <th>Request ID</th>
            <th>Date</th>
            <th>Requested By</th>
            <th>SFU ID</th>
            <th>Location</th>
            <th>Event Date</th>
          </tr>
          {rows}
        </table>
      </div>
    </div>
  );
  */
}

export default withStyles(ServiceView, s);
