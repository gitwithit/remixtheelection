// ------- VAR SETUP ------ //
var sounds, player, recordStatus, playerState, activeButton;
var recording = {};
var baseURL = 'http://www.remixtheelection.com/';
var ytID = 'Wch3gJG2GJ4';

// ------ SOUNDMANGER ------ //
soundManager.setup({
  url: 'swf/',
  onready: function() {
    $(document).ready(function() {
      // SM2 and jQuery ready
      init();
    });
  },
  ontimeout: function() {
 	alert('Sorry, but our sound manager failed to start. Please try again in another browser.');
    console.log('SM2 failed to start.');
    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?// See the flashblock demo when you want to start getting fancy.
  }
});

// ------ INIT ------ //
function init() {
	loadYouTubeAPI();

	// TODO move keycodes into global object, check and assign on addsound
	keyMonitor(97, 'romneyButton1');
	keyMonitor(115, 'romneyButton2');
	keyMonitor(100, 'romneyButton3');

	keyMonitor(107, 'obamaButton1');
	keyMonitor(108, 'obamaButton2');
	keyMonitor(59, 'obamaButton3');

  $('.hide_me').animate({'margin-top': '-50px'},1500);

	$('#info').on('click', function() {
		var togglePx = '-50px';
		if ($('.hide_me').css('margin-top') == togglePx) {
      $('.hide_me').animate({'margin-top': '-230px'},800);
			$('#info').button('toggle');
			$('#info').html('Show instructions');
		} else {
      $('.hide_me').animate({'margin-top': togglePx},800);
			$('#info').button('toggle');
			$('#info').html('Hide instructions');
		}
	});

  $.getJSON(baseURL+'sounds.json.php', function(data) {
    sounds = data;

    $('#obamaClips, #romneyClips').empty();
    // Dems
    $.each(data.democrats, function(key, val) {
      loadSound(val.id, baseURL+val.sound_url, null);
      $('#obamaClips').append('<div class="btn-group"><button onclick="javascript: playSound(\''+val.id+'\', null);" class="btn btn-primary"><i class="icon-play icon-white"></i></button><button onclick="javascript: applySound(\''+val.id+'\', \'obamaModal\'); return false" id="build_that" class="btn btn-primary">"'+val.name+'"</button></div>');
    });

    // Rep
    $.each(data.republicans, function(key, val) {
      loadSound(val.id, baseURL+val.sound_url, null);
      $('#romneyClips').append('<div class="btn-group"><button onclick="javascript: playSound(\''+val.id+'\', null);" class="btn btn-danger"><i class="icon-play icon-white"></i></button><button onclick="javascript: applySound(\''+val.id+'\', \'romneyModal\'); return false" id="build_that" class="btn btn-danger">"'+val.name+'"</button></div>');
    });
  });
}

// ------ UI ------ //

function openModal(modalID, buttonID) {
	activeButton = buttonID;
	$('#'+modalID).modal('show');
}

function applySound(soundID, modal) {
	var shortName;
	var iconClass;
	if (modal == 'obamaModal') {
		shortName = sounds.democrats[soundID]['name'];
		iconClass = 'btn-primary';
	} else {
		shortName = sounds.republicans[soundID]['name'];
		iconClass = 'btn-danger';
	}
	shortName = shortName.substring(0, 8);
	shortName = shortName+'..';

	$('#'+activeButton).replaceWith('<div class="btn-group"><button onclick="javascript: playSound(\''+soundID+'\', \''+activeButton+'\'); return false" id="'+activeButton+'" class="btn '+iconClass+'">'+shortName+'</button><button onclick="javascript: resetButton(\''+modal+'\', \''+activeButton+'\', \''+shortName+'\', \''+iconClass+'\', \''+soundID+'\'); return false" class="btn '+iconClass+'"><i class="icon-remove icon-white"></i></button></div>');
	$('#'+modal).modal('hide');
}

function resetButton(modal, activeButton, shortName, iconClass, soundID){
  openModal(modal, activeButton);
  $('#'+activeButton).parent('.btn-group').replaceWith('<button onclick="javascript: openModal(\''+soundID+'\', \''+activeButton+'\'); return false" id="'+activeButton+'" data-toggle="modal" class="btn '+iconClass+'">Add Sound</button>');
}

function keyMonitor(keyCode, buttonID) {
	$(document).keypress(function(e){
		if (e.which == keyCode){
			$('#'+buttonID).click();
		}
	});
}

// ------ YOUTUBE ------ //

function loadYouTubeAPI() {
  // load the YT API asynchronously
  var tag = document.createElement('script');
  tag.src = "//www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
}
// build the iframe
function onYouTubeIframeAPIReady() {
  player = new YT.Player('iframe', {
    height: '225',
    width: '300',
    videoId: ytID,
    playerVars: {
      'wmode': 'opaque',
      'version': 3,
      'autohide': 0,
      'iv_load_policy': 3,
      'rel': 0,
      'showinfo': 0,
      'theme': 'light',
      'enablejsapi': 1,
      'playerapiid': 'ytplayer',
      'origin': 'http://www.remixtheelection.com'
    },
    events: {
      'onReady': onPlayerReady,
      'onStateChange': onPlayerStateChange
    }
  });
}
function onPlayerReady(event) {
  player.setVolume(70);

  // load in the mix if there is one
  if(getURLParameter('m')) {
    var mixID = getURLParameter('m');
    $('#playButtonShare').attr('onclick', 'loadMix(\''+mixID+'\'); return false').attr('data-dismiss', 'modal');
    $('#davidsShareModal').modal('show');
  } else {
    // event.target.playVideo();
  }
}
function onPlayerStateChange(event) {
  playerState = event.data;
  if (playerState == 3) {
    $('.playPauseMusic').loadOverStart();
  } else {
    $('.playPauseMusic').loadOverStop();
  }
}
function youtube_parser(url){
  var regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#\&\?]*).*/;
  var match = url.match(regExp);
  if (match&&match[2].length==11){
      return match[2];
  } else {
      return false;
  }
}
function swapYoutube(id) {
  recordStatus = '';
  if ($('#playButton').hasClass('disabled')) {
		$('#playButton').removeClass('disabled');
		$('#playButton .icon-play').addClass('icon-pause').removeClass('icon-play');
  }
  if (id === null) {
    ytID = youtube_parser($('#ytLink').val());
    $('#youtubeModal').modal('hide');
  } else {
    ytID = id;
  }
  if (ytID) {
    player.loadVideoById(ytID, 0, null);
    //player.playVideo();
    player.setVolume(70);
  } else {
    alert('Please enter a valid YouTube link.');
  }
}

// ------ SOUNDS ------ //
function loadSound(id, url, callback) {
  var sound = soundManager.createSound({
      id: id,
      url: url,
      autoLoad: true,
      onload: function() {
        callback(sound);
      }
    });
}
function getSound(sound) {
  return soundManager.getSoundById(sound);
}
function loopSound(sound) {
  sound.play({
    onfinish: function() {
      loopSound(sound);
    }
  });
}
function playSound(id, button) {
  var sound = getSound(id);

  if (recordStatus == 'recording') {
	var time = player.getCurrentTime();
    recording[time] = {};
    recording[time]['ytID'] = ytID;
    recording[time]['time'] = time;
    recording[time]['soundID'] = id;
    // console.log('Sound '+id+' with YouTube '+ytID+' played at '+time);
  }

  if (button !== null) {
    var candidate = button.slice(0, -1);
    var btnId;
    if (candidate == 'romneyButton') {
      btnId = button.charAt(button.length-1);
    } else {
      btnId = button.charAt(button.length-1);
      // console.log('obama'+btnId);
      btnId = parseFloat(btnId)+3;
      // console.log('obamanxt'+btnId);
    }
    animateHead(btnId, 6, 100);
  }

  sound.play();
}


// $().button('loading');
// $().button('reset');

// ------ RECORDING ------ //
function startRecording() {
	if(recordStatus != 'recording') {
		player.seekTo(0, false);
		recordStatus = 'recording';
	} else {
		recordStatus = '';
		stop();
		shareRecording();
	}
  $('#recordButton').button('toggle');
}
function shareRecording() {
	$('#shareModal').modal('show');

	function callback(url) {
		$('#shareModal .shareURL').text(url);
		$('#shareModal .shareTweet').html('<a href="https://twitter.com/share/?url='+url+'&hashtags=RemixtheElection" target="_blank" class="twitter-share-button btn btn-primary">Tweet</a>');
		$('#shareModal .shareFacebook').html('<a href="https://facebook.com/sharer.php?u='+url+'&t=Remix%20the%20Election" target="_blank" class="btn btn-primary">Facebook</a>');
	}

	var shareURL = submitMix(recording, callback);
}
function playToggle() {
	if ($('#playButton').hasClass('disabled')) {
		$('#playButton').removeClass('disabled');
		stop();
	}
	if (playerState == 1) {
		player.pauseVideo();
		$('#playButton .icon-pause').addClass('icon-play').removeClass('icon-pause');
	} else {
		player.playVideo();
		$('#playButton .icon-play').addClass('icon-pause').removeClass('icon-play');
	}
}
function stop() {
  recordStatus = 'stopped';
  $('#playButton .icon-play').addClass('icon-pause').removeClass('icon-play');
  player.pauseVideo();
}
function loadMix(id) {
  $.getJSON(baseURL+'mixLoad.json.php?id='+id, function(data) {
    //console.log('LOAD MIX');
    //console.log(data);
    if(data['success']){
      playMix(data.success);
      setTimeout(function() { $('#sharedTimeout').modal('show'); }, 30000);
    } else if(data['failure']) {
      alert(data.failure);
    } else {
      alert('Sorry, there was an error retrieving this mix.');
    }
  });
}
function playMix(recording) {
  $('#playButton').removeClass('disabled');
  $('#playButton .icon-play').addClass('icon-pause').removeClass('icon-play');

  if (ytID != recording.ytID) {
	// swap and play
    swapYoutube(recording.ytID);
    recordStatus = 'playing';
  } else {
    // already loaded
    player.seekTo(0, false);
    player.playVideo();
    recordStatus = 'playing';
  }

  window.setInterval(function(){
    if (recordStatus == 'playing') {
      if (playerState == 1) {
        var currTime = player.getCurrentTime();
        $.each(recording, function(key, val) {
          if((currTime+0.250 < val.time) && (val.time < (currTime + 0.500))) {
            //console.log('firing '+val.soundID+' at '+val.time+' currTime '+currTime);
            var timeToPlay = Math.round((val.time-currTime)*1000);
            setTimeout(function() {
              playSound(val.soundID, null);
              var candid = val.soundID.charAt(0);
              if (candid == 'R'){
                animateHead(getRandomizer(1,3), 6, 100);
              } else {
                animateHead(getRandomizer(4,6), 6, 100);
              }
            }, timeToPlay);
          }
        });
      } else {
        // player state changed - prevents ID loading :/
        // recordStatus = 'stopped';
        // return false;
      }
    } else {
      // recording state changed
      return false;
    }
  }, 250);
}
function submitMix(mix, callback) {
  stop();
  mix.ytID = [];
  mix.ytID = ytID;
  $.ajax({
    url: baseURL+"mixProcess.php",
    data: {	'mix': mix },
    dataType: 'json',
    type: 'post',
    success: function(data) {
      var url = baseURL+'?m='+data.success;
      callback(url);
    }
  });
}

function animateHead(headID, interval, duration) {
  for (var i =0; i< interval; i++){
    $('#'+headID).animate({
      'margin-top': '-283px'
    }, duration).animate({
      'margin-top': '-290px'
    }, duration, function() {
      //console.log('animated head '+headID);
    });
  }
}

// ------ GENERAL FUNCTIONS ------ //
function getURLParameter(name) {
    return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.search)||[,""])[1].replace(/\+/g, '%20'))||null;
}

function getRandomizer(bottom, top) {
    return Math.floor(Math.random() * (top - bottom + 1)) + bottom;
}

