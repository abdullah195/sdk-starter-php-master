



var activeRoom;
var previewTracks;
var identity;
var roomName;



function attachTracks(tracks, container) {
  tracks.forEach(function(track) {
    container.appendChild(track.attach());
  });

}




function attachParticipantTracks(participant, container) {
  var tracks = Array.from(participant.tracks.values());
  attachTracks(tracks, container);
}


function detachTracks(tracks) {
  tracks.forEach(function(track) {
    track.detach().forEach(function(detachedElement) {
      detachedElement.remove();
    });
  });
}

function detachParticipantTracks(participant) {
  var tracks = Array.from(participant.tracks.values());
  detachTracks(tracks);
}

// Check for WebRTC
if (!navigator.webkitGetUserMedia && !navigator.mozGetUserMedia) {
  alert('WebRTC is not available in your browser.');
}

// When we are about to transition away from this page, disconnect
// from the room, if joined.
window.addEventListener('beforeunload', leaveRoomIfJoined);

// $.getJSON('/token.php', function(data) {
//
//
//
//   identity = data.identity;
//
//   document.getElementById('room-controls').style.display = 'block';
//
//   // Bind button to join room
//   document.getElementById('button-join').onclick = function () {
//     roomName = document.getElementById('room-name').value;
//     if (roomName) {
//       log("Joining room '" + roomName + "'...");
//
//       var connectOptions = { name: roomName, logLevel: 'debug' };
//       if (previewTracks) {
//         connectOptions.tracks = previewTracks;
//       }
//
//       console.log('token id video:'+data.token);
//
//
//       Twilio.Video.connect(data.token, connectOptions).then(roomJoined, function(error) {
//         log('Could not connect to Twilio: ' + error.message);
//       });
//
//
//     } else {
//       alert('Please enter a room name.');
//     }
//   };
//
//   // Bind button to leave room
//   document.getElementById('button-leave').onclick = function () {
//     log('Leaving room...');
//     activeRoom.disconnect();
//   };
//
//
//
// });





// Successfully connected!
function roomJoined(room) {
  activeRoom = room;

  log("Joined as '" + identity + "'");
  document.getElementById('button-join').style.display = 'none';
  document.getElementById('button-leave').style.display = 'inline';

  // Draw local video, if not already previewing
  var previewContainer = document.getElementById('local-media');
  if (!previewContainer.querySelector('video')) {
    attachParticipantTracks(room.localParticipant, previewContainer);
  }

  room.participants.forEach(function(participant) {
    log("Already in Room: '" + participant.identity + "'");
    var previewContainer = document.getElementById('remote-media');
    attachParticipantTracks(participant, previewContainer);
  });

  // When a participant joins, draw their video on screen
  room.on('participantConnected', function(participant) {
    log("Joining: '" + participant.identity + "'");
  });

  room.on('trackAdded', function(track, participant) {
    log(participant.identity + " added track: " + track.kind);
    var previewContainer = document.getElementById('remote-media');
    attachTracks([track], previewContainer);
  });

  room.on('trackRemoved', function(track, participant) {
    log(participant.identity + " removed track: " + track.kind);
    detachTracks([track]);
  });

  // When a participant disconnects, note in log
  room.on('participantDisconnected', function(participant) {
    log("Participant '" + participant.identity + "' left the room");
    detachParticipantTracks(participant);
  });

  // When we are disconnected, stop capturing local video
  // Also remove media for all remote participants
  room.on('disconnected', function() {
    log('Left');
    detachParticipantTracks(room.localParticipant);
    room.participants.forEach(detachParticipantTracks);
    activeRoom = null;
    document.getElementById('button-join').style.display = 'inline';
    document.getElementById('button-leave').style.display = 'none';
  });
}

//  Local video preview
document.getElementById('button-preview').onclick = function() {
  var localTracksPromise = previewTracks
      ? Promise.resolve(previewTracks)
      : Twilio.Video.createLocalTracks();

  localTracksPromise.then(function(tracks) {
    previewTracks = tracks;
    var previewContainer = document.getElementById('local-media');
    if (!previewContainer.querySelector('video')) {
      attachTracks(tracks, previewContainer);
    }
  }, function(error) {
    console.error('Unable to access local media', error);
    log('Unable to access Camera and Microphone');
  });
};

// Activity log
function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}



function leaveRoomIfJoined() {
  if (activeRoom) {
    activeRoom.disconnect();
  }
}





/////////////////////////////////////

//  $(function() {



  // Get handle to the chat div
  var $chatWindow = $('#messages');

  // Our interface to the Chat service
  var chatClient;

  // A handle to the "general" chat channel - the one and only channel we
  // will have in this sample app
  var generalChannel;

  // The server will assign the client a random username - store that value
  // here
  var username;

  // Helper function to print info messages to the chat window
  function print(infoMessage, asHtml) {
    var $msg = $('<div class="info">');
    if (asHtml) {

      $msg.html(infoMessage);

    } else {

      $msg.text(infoMessage);

    }
    $chatWindow.append($msg);
  }

  // Helper function to print chat message to the chat window
  function printMessage(fromUser, message) {
    var $user = $('<span class="username">').text(fromUser + ':');
    if (fromUser === username) {
      $user.addClass('me');
    }
    var $message = $('<span class="message">').text(message);
    var $container = $('<div class="message-container">');
    $container.append($user).append($message);
    $chatWindow.append($container);
    $chatWindow.scrollTop($chatWindow[0].scrollHeight);
  }

  // Alert the user they have been assigned a random username
  print('Logging in...');

  // Get an access token for the current user, passing a username (identity)
  // and a device ID - for browser-based apps, we'll always just use the
  // value "browser"
  $.getJSON('/token.php', {
    device: 'browser'
  }, function(data) {


    ///////////Video code start//////////////

    identity = data.identity;

    document.getElementById('room-controls').style.display = 'block';

    // Bind button to join room
    document.getElementById('button-join').onclick = function () {
      roomName = document.getElementById('room-name').value;
      if (roomName) {
        log("Joining room '" + roomName + "'...");

        var connectOptions = { name: roomName, logLevel: 'debug' };
        if (previewTracks) {
          connectOptions.tracks = previewTracks;
        }

        console.log('token id video:'+data.token);


        Twilio.Video.connect(data.token, connectOptions).then(roomJoined, function(error) {
          log('Could not connect to Twilio: ' + error.message);
        });


      } else {
        alert('Please enter a room name.');
      }
    };

    // Bind button to leave room
    document.getElementById('button-leave').onclick = function () {
      log('Leaving room...');
      activeRoom.disconnect();
    };














    /////////////video code end ///////////////

console.log('token id chat:'+data.token);


    // Initialize the Chat client
    Twilio.Chat.Client.create(data.token).then(client => {
      console.log('Created chat client');
      chatClient = client;
      chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);

    // Alert the user they have been assigned a random username
    username = data.identity;
    print('You have been assigned a random username of: '
    + '<span class="me">' + username + '</span>', true);

    }).catch(error => {
      console.error(error);
      print('There was an error creating the chat client:<br/>' + error, true);
      print('Please check your .env file.', false);
    });
  });




  function createOrJoinGeneralChannel() {
    // Get the general chat channel, which is where all the messages are
    // sent in this simple application
    print('Attempting to join "general" chat channel...');
    chatClient.getChannelByUniqueName('general')
    .then(function(channel) {
      generalChannel = channel;
      console.log('Found general channel:');
      console.log(generalChannel);
      setupChannel();
    }).catch(function() {
      // If it doesn't exist, let's create it
      console.log('Creating general channel');
      chatClient.createChannel({
        uniqueName: 'general',
        friendlyName: 'General Chat Channel'
      }).then(function(channel) {
        console.log('Created general channel:');
        console.log(channel);
        generalChannel = channel;
        setupChannel();
      }).catch(function(channel) {
        console.log('Channel could not be created:');
        console.log(channel);
      });
    });
  }

  // Set up channel after it has been found
  function setupChannel() {
    // Join the general channel
    generalChannel.join().then(function(channel) {
      print('Joined channel as '
      + '<span class="me">' + username + '</span>.', true);
    });

    // Listen for new messages sent to the channel
    generalChannel.on('messageAdded', function(message) {
      printMessage(message.author, message.body);
    });
  }

  // Send a new message to the general channel
  var $input = $('#chat-input');
  $input.on('keydown', function(e) {

    if (e.keyCode == 13) {
      if (generalChannel === undefined) {
        print('The Chat Service is not configured. Please check your .env file.', false);
        return;
      }
      generalChannel.sendMessage($input.val())
      $input.val('');
    }
  });





// });   //main function
