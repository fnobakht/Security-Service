/* request_controller.js
** Main controller for requests which come in and out of our web application
** This function concerns the email server and the make a request form
*/

"use strict";

import db from '../data/db';
import exportMethods from '../PyScripts/childProcPy'
import nodemailer from 'nodemailer';
import xoauth2 from 'xoauth2';
import expG from '../data/exportGuardsPDF';
import dbMethods from './dbCommitMethods';

//For CAS Use
const CAS_LOGIN_LINK = 'https://cas.sfu.ca/cas/login?service=https://cmpt373-1177g.cmpt.sfu.ca/login';
const CAS_LOGIN_TEMP = 'https://cas.sfu.ca/cas/login?service=https://localhost:3000/login';

/*Helper Functions*/
//Base function that sends different types of emails using EMAILSERVICE address
//Takes req, subject line, and email contents as arguments.
function sendMailTemplate(req, subjectLine, emailContents) {
  let mailOptions = {
    from: EMAILSERVICE,
    to: req.body.email,
    subject: subjectLine,
    text: emailContents,
  };
  transporter.sendMail(mailOptions, (error, info)=>{
     if(error){
        console.log(error);
    }
    console.log("Email sent from sendMailTemplate successfully!");
    console.log(info);
   });
}

//Function called to escape and trim dbParam
function escapeAndTrimInput(req, dbParam) {
  req.filter(dbParam).escape();
  req.filter(dbParam).trim();
}

//Checks if an input is empty in req, with a given dbParam Field, with a given emptyErrMessage.
function checkIfInputIsEmptyInField(req, dbParam, emptyErrMessage) {
  req.checkBody(dbParam, emptyErrMessage).notEmpty();
}
/*End Helper Functions definitions*/


//Sets up the mailing server given parameters
const EMAILSERVICE= 'gmail';
const EMAILADDR = 'cmpt373gammafrom@gmail.com';
const EMAILADDR_PASSWORD = 'Cmpt373gamma';
const EMAIL_SERVER_PORT = 25;

let transporter = nodemailer.createTransport({
  service: EMAILSERVICE,
  secure: false,
  port: EMAIL_SERVER_PORT,
  auth: {
      user: EMAILADDR,
      pass: EMAILADDR_PASSWORD,
  },
  tls:{
    rejectUnauthorized:false
  }
});


//Sends an email to the user
function sendemailToUser(req) {

const emailSubject = 'We have recieved your request!';
const emailText = 'We have received your security services request, we will get back to you as soon as it is processed. Here is the request ID: ' + req.body.id + '. If you have further questions, please contact us as soon as possible';

  sendMailTemplate(req, emailSubject, emailText);
  console.log("sendemailToUser function called successfully!");
}

//Sends an email to the user approving their security request
function sendemailToUserWithApproval(req) {

  const emailSubject = 'We have approved your request.';
  const emailText = 'We have approved your security request. It will now be forwarded into the next step of the process! Here is the request ID: ' + req.body.id + '. If you have further questions, please contact us as soon as possible';

    sendMailTemplate(req, emailSubject, emailText);
    console.log("sendemailToUserWithApproval function called successfully!");
}

//Sends an email to the user rejecting their security request
function sendemailToUserWithRejection(req) {

  const emailSubject = 'We have rejected your request...';
  const emailText = 'We have rejected your security request because your request does not meet our requirements.';

    sendMailTemplate(req, emailSubject, emailText);
    console.log("sendemailToUserWithRejection function called successfully!");
}


function sendEmailtoUserwithID(req){
  let mailOptions = {
    from: 'SFUSecurity',
    to: req.body.email,
    subject: 'We have received your request',
    text: 'We have received your security services request, we will get back to you as soon as it is processed. Here is your referenceID: ' + req.body.referenceID
,
  };
  transporter.sendMail(mailOptions, (error, info)=>{
     if(error){
        console.log(error);
    }
    console.log("Email sent from sendMailTemplate successfully!");
    console.log(info);
   });
}

function sendEmailtoUserwithIDwithRejection(req){
  let mailOptions = {
    from: 'SFUSecurity',
    to: req.body.email,
    subject: 'We have reject your request',
    text: 'We have reject your security services request, The reason of rejection can be found online. If you have further request or question, please contact us as soon as possible. Here is your referenceID: ' + req.body.referenceID
,
  };
  transporter.sendMail(mailOptions, (error, info)=>{
     if(error){
        console.log(error);
    }
    console.log("Email sent from sendMailTemplate successfully!");
    console.log(info);
   });
}

//Checks request information input for whether or not they are empty
function checkIfRequestInformationNotEmpty(req) {

  checkIfInputIsEmptyInField(req, 'date', 'parameter: date must be specified');
  checkIfInputIsEmptyInField(req, 'department', 'parameter: department must be specified');
  checkIfInputIsEmptyInField(req, 'requestedBy', 'parameter: requestedBy must be specified');
  checkIfInputIsEmptyInField(req, 'phone', 'parameter: phone must be specified');
  checkIfInputIsEmptyInField(req, 'fax', 'parameter: fax is optional');
  checkIfInputIsEmptyInField(req, 'nameOfEvent', 'parameter: nameOfEvent must be specified');
  checkIfInputIsEmptyInField(req, 'licensed', 'parameter: licensed must be specified');
  checkIfInputIsEmptyInField(req, 'invoice', 'parameter: invoice must be specified');
  checkIfInputIsEmptyInField(req, 'location', 'parameter: location must be specified');
  checkIfInputIsEmptyInField(req, 'eventDate', 'parameter: eventDate must be specified');
  checkIfInputIsEmptyInField(req, 'detail', 'parameter: detail must be specified');
  checkIfInputIsEmptyInField(req, 'firstName', 'parameter: firstName must be specified');
  checkIfInputIsEmptyInField(req, 'lastName', 'parameter: lastName name must be specified');
  checkIfInputIsEmptyInField(req, 'userName', 'parameter: userName name must be specified');
  checkIfInputIsEmptyInField(req, 'email', 'parameter: email must be specified');
  checkIfInputIsEmptyInField(req, 'numberOfAttendees', 'parameter: numberOfAttendees must be specified');
  checkIfInputIsEmptyInField(req, 'time', 'parameter: time must be specified');
  checkIfInputIsEmptyInField(req, 'endtime', 'parameter: end time must be specified');
  checkIfInputIsEmptyInField(req, 'emergencyContact', 'emergencyContact: phone must be specified');


}

//Escapes and filters each entry in the database
function filterInputInRequestInformation(req) {

var inputArray = [];

inputArray.push('date');
inputArray.push('department');
inputArray.push('requestedBy');
inputArray.push('phone');
inputArray.push('fax');
inputArray.push('nameOfEvent');
inputArray.push('licensed');
inputArray.push('invoice');
inputArray.push('location');
inputArray.push('eventDate');
inputArray.push('detail');
inputArray.push('firstName');
inputArray.push('lastName');
inputArray.push('userName');
inputArray.push('email');
inputArray.push('numberOfAttendees');
inputArray.push('time');
inputArray.push('endtime');
inputArray.push('emergencyContact');


inputArray.forEach(function(element) {
    escapeAndTrimInput(req, element);
});

}

exports.request_post = function (req, res, next) {
  console.log("create databases;");
  console.log(req.body.secondDate);
  console.log(req.body.thirdDate);
  console.log(req.body.fourthDate);
  console.log(req.body.fifthDate);
  console.log(req.body.additionalEvenDate);

  checkIfRequestInformationNotEmpty(req);
  filterInputInRequestInformation(req);
  dbMethods.commitRequestToDB(req);

  sendemailToUser(req);


};


exports.get_accessID = function (req, res, next) {
  checkIfRequestInformationNotEmpty(req, 'referenceID', 'Reference ID must be specified');
  escapeAndTrimInput(req, 'referenceID');

  res.redirect('/StatusForm/' + req.body.referenceID + "/" + req.body.email);
  console.log(req.body.referenceID);
  console.log(req.body.email);
};
exports.get_guardJobs = function(req, res, next){
  checkIfRequestInformationNotEmpty(req, 'dispatchNumber', 'Dispatch number must be specified');
  escapeAndTrimInput(req, 'dispatchNumber');
  res.redirect('/GuardJobs/' + req.body.dispatchNumber);
};

//Sanitizes input in exports.request_approve
function sanitizeRequestApprove(req) {
  escapeAndTrimInput(req, 'requestID');

  checkIfRequestInformationNotEmpty(req, 'supervisor', 'Supervisor must be specified');
  checkIfRequestInformationNotEmpty(req, 'distribution', 'Distribution must be specified');
  checkIfRequestInformationNotEmpty(req, 'guardRegularRate', 'Guard regular rate must be specified');
  checkIfRequestInformationNotEmpty(req, 'guardRegularHours', 'Guard regular hours must be specified');
  checkIfRequestInformationNotEmpty(req, 'guardOTRate', 'Guard overtime rate must be specified');
  checkIfRequestInformationNotEmpty(req, 'guardOTHours', 'Guard overtime hours must be specified');
  checkIfRequestInformationNotEmpty(req, 'scspRegularRate', 'SCSP regular rate must be specified');
  checkIfRequestInformationNotEmpty(req, 'scspRegularHours', 'SCSP regular hours must be specified');
  checkIfRequestInformationNotEmpty(req, 'scspOTRate', 'SCSP overtime rate must be specified');
  checkIfRequestInformationNotEmpty(req, 'scspOTHours', 'SCSP overtime hours must be specified');
  checkIfRequestInformationNotEmpty(req, 'totalGuardBillable', 'Total guard billable must be specified');
  checkIfRequestInformationNotEmpty(req, 'totalSCSPBillable', 'Total SCSP billable must be specified');
  checkIfRequestInformationNotEmpty(req, 'preparedBy', 'PreparedBy field must be specified');
  checkIfRequestInformationNotEmpty(req, 'signature', 'No signature is provided');

  escapeAndTrimInput(req, 'supervisor');
  escapeAndTrimInput(req, 'distribution');
  escapeAndTrimInput(req, 'distributionOther');
  escapeAndTrimInput(req, 'guardRegularRate');
  escapeAndTrimInput(req, 'guardRegularHours');
  escapeAndTrimInput(req, 'guardOTRate');
  escapeAndTrimInput(req, 'guardOTHours');
  escapeAndTrimInput(req, 'scspRegularRate');
  escapeAndTrimInput(req, 'scspRegularHours');
  escapeAndTrimInput(req, 'scspOTRate');
  escapeAndTrimInput(req, 'scspOTHours');
  escapeAndTrimInput(req, 'totalGuardBillable');
  escapeAndTrimInput(req, 'totalSCSPBillable');
  escapeAndTrimInput(req, 'preparedBy');
  escapeAndTrimInput(req, 'signature');
}

exports.request_approve = function (req, res, next) {

  sanitizeRequestApprove(req);

  console.log(req.body);

  dbMethods.commitApproveToDB(req);
  sendemailToUserWithApproval(req);
  res.redirect('/ServiceView');
};

exports.request_reject = function (req, res, next) {
  escapeAndTrimInput(req, 'requestID');

  sendemailToUserWithRejection(req);

  db.models.request.update(
    {status : 'Rejected'},
    {where: {accessID: req.body.requestID}},
  ).then(() => {
    res.redirect('/ServiceView');
  });
};

exports.check_status = function (req, res, next) {

  checkIfRequestInformationNotEmpty(req, 'referenceID', 'Reference ID must be specified');
  escapeAndTrimInput(req, 'requestID');

  res.redirect('/StatusForm');
};

exports.export_to_pdf = function (req, res, next) {

  exportMethods.exportReqToPDF(req.body.referenceID);

  // Have to wait about 10 seconds to let the python script finish
  // running and then locate the file in the ExportedPDFs directory
  // Couldn't find a method to sleep thread in JS (wtf)

  const waitTimeInMS = 10000;
  const downloadPDFName = 'request.pdf';

  setTimeout(() => {
    let filePath = exportMethods.locateFilePath(req.body.referenceID, false);

    if (filePath) {
      console.log(`File path was: ${filePath}`);

      res.download(filePath.toString(), downloadPDFName);
    } else {
      console.log("INVALID PATH");
      res.redirect("/");
    }
  }, waitTimeInMS);
};

exports.get_guards = function(req, res, next){
  res.redirect('/GuardView');
};
exports.guardExport = async (req, res) => {
  const reqID = req.body.referenceID;

  let data = [];

  await expG.exportGuards(reqID).then((resp) => {
    console.log(`EXPORTED TO ${resp}`);
    data = resp;

    setTimeout(() => {
      if(data) {

        res.download(data);
      } else {
        res.redirect("/");
      }
    }, 5000);
  });
};

//For CAS Use
exports.casredirect = function(req, res) {

  console.log("LOGIN ATTEMPT");
  res.redirect(CAS_LOGIN_TEMP);
};

exports.login = function(req, res) {
  res.send("LOGIN SCREEN");
};
