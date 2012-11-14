soundManager.setup({
  url: 'swf/',

  onready: function() {
    $(document).ready(function() {
      // SM2 and jQuery ready
      init();
    });
  },
  ontimeout: function() {
    console.log('SM2 failed to start.');
    // Hrmm, SM2 could not start. Missing SWF? Flash blocked? Show an error, etc.?// See the flashblock demo when you want to start getting fancy.
  }
});

var sounds;
var intervalQue;
var activeSounds = [];
var idIntervals = [];
var music = 'clique';
var baseURL = 'http://www.remixtheelection.com/';

function init() {
  $.getJSON(baseURL+'sounds.json.php', function(data) {
    sounds = data;

    // Music
    $.each(data.music, function(key, val) {
      loadSound(val.id, baseURL+val.sound_url, function(sound) {
        // callback
        if(val.id == music) {
          loopSound(sound);
        }
      });
    });

    // Dems
    $.each(data.democrats, function(key, val) {
      idIntervals[val.id] = val.sound_intervals;
      loadSound(val.id, baseURL+val.sound_url, null);
      $('#dems').append('<li><a href="#"" onclick="javascript: soundToggle(\''+val.id+'\');">'+val.name+'</a></li>');
    });

    // Rep
    $.each(data.republicans, function(key, val) {
      idIntervals[val.id] = val.sound_intervals;
      loadSound(val.id, baseURL+val.sound_url, null);
      $('#reps').append('<li><a href="#"" onclick="javascript: soundToggle(\''+val.id+'\');">'+val.name+'</a></li>');
    });
  });
}

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

function intervalSet(music, sound, intervals) {
  $.each(intervals, function(key, interval) {
    music.onPosition(interval, function(eventPosition) {
      if (intervalQue == sound.id) {
        console.log('clearing que');
        intervalQue = '';
      } else {
        console.log('playing');
        sound.play();
      }
    });
    console.log(music);
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

// UI

function soundToggle(id) {
  var soundID = getSound(id);
  var musicID = getSound(music);
  if (activeSounds[id] !== true) {
    intervalQue = soundID.id;
    intervalSet(musicID, soundID, idIntervals[id]);
    activeSounds[id] = true;
  } else {
    $.each(idIntervals[id], function(key, interval) {
      musicID.clearOnPosition(interval, null);
    });
    activeSounds[id] = false;
  }

}

function changeMusic(id) {
  var musicID = getSound(music);
  var nextMusicID = getSound(id);

  musicID.unload();
  loopSound(nextMusicID);
  music = id;
}