/***********************************************
 * Author: Muhammad Zakirin
 * 
 * Mitcom Sdn. Bhd.
 * 
 * Released: September 2023
 * Updated: September 2023
 * 
 * Channel: Production
 * 
 * Name: System_Control_1-0
 * Version: 1.0
 * 
 * Description: UI for the System Control
 * 
 * Script Dependencies
 *   - System_Control_1-0.js - Backend
 *   - System_Control_1-0.xml - Fontend
 ***********************************************/

import xapi from 'xapi';

const confirmationValue = 'confirmation';

async function initiatePowerControl(powerControlValue) {
  try {
    await xapi.Command.SystemUnit.Boot( {
      Action: powerControlValue
    } )
  } catch (error) {
      console.error('Not able to set Power Control with error:' + error);
  }
}

async function setSystemState(systemStateValue) {
  try {
    await xapi.command("Standby " + systemStateValue);
    //await xapi.Command.Standby.set(systemStateValue);
  } catch (error) {
      console.error('Not able to set System State with error:' + error);
  }
}

async function getConfirmation(promptText){
  try {
    await xapi.Command.UserInterface.Message.Prompt.Display( {
      FeedbackId: confirmationValue + ' ' + promptText,
      Title: promptText + ' CONFIRMATION', /* Create a custom title for your meeting Input Display here */
      Text: 'Are you sure want to ' + promptText + ' the device?',
      'Option.1': 'No',
      'Option.2': 'Yes',
    })
  } catch (error) {
    console.error('Not able to set Prompt Confirmation with error:' + error);
  }
}

function init () {
  xapi.Event.UserInterface.Extensions.Widget.Action.on((event) => {
    if(event.Type == 'clicked') {
      switch(event.WidgetId) {
        case 'system_state_halfwake':
          var systemStateValue = 'Halfwake';
          console.log('System State Input: ' + systemStateValue);
          setSystemState(systemStateValue);
          break;
        case 'system_state_standby':
          var systemStateValue = 'Activate';
          console.log('System State Input: ' + systemStateValue);
          setSystemState(systemStateValue);
          break;
        case 'power_control_restart':
          var promptText = 'RESTART';
          getConfirmation(promptText);
          break;
        case 'power_control_shutdown':
          var promptText = 'POWER SHUTDOWN';
          getConfirmation(promptText);
          break;

      }
        
      
    }
  });

  xapi.Event.UserInterface.Message.Prompt.Response.on((event) => {
    switch(event.FeedbackId){
      case 'confirmation POWER SHUTDOWN':
        if (event.OptionId == '2') {
          var powerControlValue = 'Shutdown';
          initiatePowerControl(powerControlValue);
          console.log('Power Shutdown');
        }
        else {
          console.log('Cancel Power Shutdown');
        }
        break;
      case 'confirmation RESTART':
        if (event.OptionId == '2') {
          var powerControlValue = 'Restart';
          initiatePowerControl(powerControlValue);
          console.log('Restart');
        }
        else {
          console.log('Cancel Restart');
        }
        break;
    }
});

}

init();
