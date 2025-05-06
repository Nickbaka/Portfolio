(function($) {
    var Password = function($object, options) {
      var defaults = {
        minimumLength: 4,
        steps: {
          15: 'Really insecure password',
          40: 'Weak; try combining letters & numbers',
          65: 'Medium; try using special characters',
          90: 'Strong password'
        }
      };
  
      options = $.extend({}, defaults, options);
  
      function calculateScore(password) {
        var score = 0;
  
        if (password.length < options.minimumLength) {
          return -1;
        }
  
        score += password.length * 4;
        score += checkRepetition(1, password).length - password.length;
        score += checkRepetition(2, password).length - password.length;
        score += checkRepetition(3, password).length - password.length;
        score += checkRepetition(4, password).length - password.length;
  
        if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
          score += 5;
        }
  
        var symbols = '.*[!,@,#,$,%,^,&,*,?,_,~]';
        symbols = new RegExp('(' + symbols + symbols + ')');
        if (password.match(symbols)) {
          score += 5;
        }
  
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
          score += 10;
        }
  
        if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
          score += 15;
        }
  
        if (password.match(/([!@#$%^&*?_~])/) && password.match(/([0-9])/)) {
          score += 15;
        }
  
        if (password.match(/([!@#$%^&*?_~])/) && password.match(/([a-zA-Z])/)) {
          score += 15;
        }
  
        if (password.match(/^\w+$/) || password.match(/^\d+$/)) {
          score -= 10;
        }
  
        return Math.max(0, Math.min(100, score));
      }
  
      function checkRepetition(length, str) {
        var res = "", repeated = false;
        for (var i = 0; i < str.length; i++) {
          repeated = true;
          for (var j = 0; j < length && (j + i + length) < str.length; j++) {
            repeated = repeated && (str.charAt(j + i) === str.charAt(j + i + length));
          }
          if (j < length) {
            repeated = false;
          }
          if (repeated) {
            i += length - 1;
            repeated = false;
          } else {
            res += str.charAt(i);
          }
        }
        return res;
      }
  
      function getScoreText(score) {
        if (score === -1) {
          return 'The password is too short';
        }
  
        score = score < 0 ? 0 : score;
  
        var sortedStepKeys = Object.keys(options.steps).sort();
        for (var step of sortedStepKeys) {
          if (step > score) {
            return options.steps[step];
          }
        }
  
        return 'Strong password';
      }
  
      var $strengthText = $('<div>').addClass('pass-strength-text');
      $object.after($strengthText);
  
      $object.on('keyup', function() {
        var score = calculateScore($object.val());
        var text = getScoreText(score);
        $strengthText.text(text);
      });
    };
  
    $.fn.password = function(options) {
      return this.each(function() {
        new Password($(this), options);
      });
    };
  })(jQuery);