$(function () {
    $('form input').on('keyup', function() {
        var val = $(this).val().trim();
        if (isColor(val)) {
            $(this).siblings('.preview').css('background-color', '#'+val);
        } else {
            $(this).siblings('.preview').removeAttr('style');
        }
    });

    $('form button').on('click', function(e) {
        e.preventDefault();
        var base = $('#base').val().trim(),
            target = $('#target').val().trim();

        base = createColor(base);
        target = createColor(target);

        if (base && target) {
            var diff = getDiffPercentage(getDiff(base, target));

            $('#results').html('The difference between colors is ' + diff + '%.');
            compute(base, target);
        } else {
            $('#results').html('Unable to calculate');
        }
    });

    function isColor(color) {
        return (/^([0-9a-f]{3}){1,2}$/gi).test(color);
    }

    function createColor(color) {
        if (!isColor(color)) {
            return null;
        }

        return new less.tree.Color(color);
    }

    function getDiff(color1, color2) {
        return less.tree.functions.difference(color1, color2);
    }

    function getAverage(color1, color2) {
        return less.tree.functions.average(color1, color2);
    }

    function compute(base, target) {
        var _base = base.toHSL();
        var _target = target.toHSL();

        var _h = _target.h - _base.h;
        var _s = _target.s - _base.s;
        var _l = _target.l - _base.l;

        var message = 'To get the desired color, spin ' + _h + ', saturate ' + _s*100 + '%, ';
        if (_l < 0) {
            message += 'darken ' + -_l*100;
        } else {
            message += 'lighten ' + _l*100;
        }
        message += '%.';

        $('#results').append('<p>' + message + '</p>');

        var __h = Math.round(_h);
        var __s = Math.round(_s*100);
        var __l = Math.round(_l*100);

        var resultMessage = '</br>Result with spin ' + __h + ', saturate ' + __s + '%, ';
        if (_l < 0) {
            resultMessage += 'darken ' + -__l;
        } else {
            resultMessage += 'lighten ' + __l;
        }

        var resultColor = new less.tree.functions.spin(base, { value: __h });
        resultColor = new less.tree.functions.saturate(resultColor, { value: __s });
        resultColor = new less.tree.functions.lighten(resultColor, { value: __l });

        var diff = getDiffPercentage(getDiff(target, resultColor));

        resultMessage += '% (' + diff + '% difference):</br><span class="result-preview" style="background-color: ' + resultColor.toCSS() + ';"></span>';

        $('#results').append(resultMessage);

    }

    function getDiffPercentage(diff) {
        var result = 0;
        _.each(diff.rgb, function (val) {
            result += val / 255 * 100;
        });
        result = Math.round(result / 3);

        return result;
    }
});
