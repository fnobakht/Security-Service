import React from 'react';
import RequestView from './RequestView';
import fetch from '../../core/fetch';
import dbMethods from '../../core/dbFetchMethods';

export const path = '/ServiceView/:id';
export const action = async (state) => {
  const response = await fetch('/graphql?query={news{title,link,contentSnippet}}');
  const { data } = await response.json();
  state.context.onSetTitle('Request View');

  let approved = false;
  console.log('state:');
  console.log(JSON.stringify(state));
  if('approved' in state.query && state.query.approved == 'yes'){
    console.log('An approve req');
    approved = true;
  }

  let res = await dbMethods.getReqByID(state.params.id);
  let rows = [];
/*
  if(res !== null) {
    for(let x = 0; x < res.length; x++) {
      rows.push({
        requestId: res[x]['accessID'],
        requestBy: res[x]['user']['requestBy'],
        date: res[x]['date'].split("T")[0],
        sfu_id: res[x]['user']['sfuBCID'],
        location: res[x]['event']['location'],
        event_date: res[x]['event']['eventDates'],
      });
    }
  }
*/
  console.log('res');
  console.log(res);

  return <RequestView
            request={res}
            requestID={state.params.id}
            approved={approved}
  />;
};
