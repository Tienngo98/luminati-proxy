webpackJsonp([1],{

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*jslint node:true, browser:true*/
(function(){

var is_node = typeof module=='object' && module.exports && module.children;
var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = date_get;

function pad(num, size){ return ('000'+num).slice(-size); }

E.ms_to_dur = function(_ms){
    var s = '';
    var sec = Math.floor(_ms/1000);
    if (sec<0)
    {
	s += '-';
	sec = -sec;
    }
    var days = Math.floor(sec/(60*60*24));
    sec -= days*60*60*24;
    var hours = Math.floor(sec/(60*60));
    sec -= hours*60*60;
    var mins = Math.floor(sec/60);
    sec -= mins*60;
    if (days)
	s += days + ' ' + (days>1 ? 'Days' : 'Day') + ' ';
    return s+pad(hours, 2)+':'+pad(mins, 2)+':'+pad(sec, 2);
};

E.dur_to_str = function(duration, opt){
    opt = opt||{};
    var parts = [];
    duration = +duration;
    function chop(period, name){
        if (duration<period)
            return;
        var number = Math.floor(duration/period);
        parts.push(number+name);
        duration -= number*period;
    }
    chop(ms.YEAR, 'y');
    chop(ms.MONTH, 'mo');
    if (opt.week)
        chop(ms.WEEK, 'w');
    chop(ms.DAY, 'd');
    chop(ms.HOUR, 'h');
    chop(ms.MIN, 'min');
    chop(ms.SEC, 's');
    if (duration)
        parts.push(duration+'ms');
    if (!parts.length)
        return '0s';
    return parts.slice(0, opt.units||parts.length).join(opt.sep||'');
};

E.monotonic = undefined;
E.init = function(){
    var adjust, last;
    if (typeof window=='object' && window.performance
        && window.performance.now)
    {
        // 10% slower than Date.now, but always monotonic
        adjust = Date.now()-window.performance.now();
        E.monotonic = function(){ return window.performance.now()+adjust; };
    }
    else if (is_node && !global.mocha_running)
    {
        // brings libuv monotonic time since process start
        var timer = process.binding('timer_wrap').Timer;
        adjust = Date.now()-timer.now();
        E.monotonic = function(){ return timer.now()+adjust; };
    }
    else
    {
        last = adjust = 0;
        E.monotonic = function(){
            var now = Date.now()+adjust;
            if (now>=last)
                return last = now;
            adjust += last-now;
            return last;
        };
    }
};
E.init();

E.str_to_dur = function(str, opt){
    opt = opt||{};
    var month = 'mo|mon|months?';
    if (opt.short_month)
        month +='|m';
    var m = str.replace(/ /g, '').match(new RegExp('^(([0-9]+)y(ears?)?)?'
    +'(([0-9]+)('+month+'))?(([0-9]+)w(eeks?)?)?(([0-9]+)d(ays?)?)?'
    +'(([0-9]+)h(ours?)?)?(([0-9]+)(min|minutes?))?'
    +'(([0-9]+)s(ec|econds?)?)?(([0-9]+)ms(ec)?)?$'));
    if (!m)
        return;
    return ms.YEAR*(+m[2]||0)+ms.MONTH*(+m[5]||0)+ms.WEEK*(+m[8]||0)
    +ms.DAY*(+m[11]||0)+ms.HOUR*(+m[14]||0)+ms.MIN*(+m[17]||0)
    +ms.SEC*(+m[20]||0)+(+m[23]||0);
};

E.months_long = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
E.months_short = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug',
    'Sep', 'Oct', 'Nov', 'Dec'];
var months_short_lc = E.months_short.map(function(m){
    return m.toLowerCase(); });
E.days_long = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday',
    'Friday', 'Saturday'];
E.days_short = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var days_short_lc = E.days_short.map(function(d){ return d.toLowerCase(); });
E.locale = {months_long: E.months_long, months_short: E.months_short,
    days_long: E.days_long, days_short: E.days_short, AM: 'AM', PM: 'PM'};
E.get = date_get;
function date_get(d, _new){
    var y, mon, day, H, M, S, _ms;
    if (d===undefined)
	return new Date();
    if (d==null)
	return new Date(null);
    if (d instanceof Date)
	return _new ? new Date(d) : d;
    if (typeof d=='string')
    {
	var m;
        d = d.trim();
	// check for ISO/SQL/JDate date
	if (m = /^((\d\d\d\d)-(\d\d)-(\d\d)|(\d\d?)-([A-Za-z]{3})-(\d\d(\d\d)?))\s*([\sT](\d\d):(\d\d)(:(\d\d)(\.(\d\d\d))?)?Z?)?$/
	    .exec(d))
	{
            H = +m[10]||0; M = +m[11]||0; S = +m[13]||0; _ms = +m[15]||0;
            if (m[2]) // SQL or ISO date
            {
                y = +m[2]; mon = +m[3]; day = +m[4];
                if (!y && !mon && !day && !H && !M && !S && !_ms)
                    return new Date(NaN);
                return new Date(Date.UTC(y, mon-1, day, H, M, S, _ms));
            }
            if (m[5]) // jdate
            {
                y = +m[7];
                mon = months_short_lc.indexOf(m[6].toLowerCase())+1;
                day = +m[5];
                if (m[7].length==2)
                {
                    y = +y;
                    y += y>=70 ? 1900 : 2000;
                }
                return new Date(Date.UTC(y, mon-1, day, H, M, S, _ms));
            }
            // cannot reach here
        }
        // check for string timestamp
        if (/^\d+$/.test(d))
            return new Date(+d);
        // else might be parsed as non UTC!
        return new Date(d);
    }
    if (typeof d=='number')
	return new Date(d);
    throw new TypeError('invalid date '+d);
}

E.to_sql_ms = function(d){
    d = E.get(d);
    if (isNaN(d))
        return '0000-00-00 00:00:00.000';
    return pad(d.getUTCFullYear(), 4)+'-'+pad(d.getUTCMonth()+1, 2)
    +'-'+pad(d.getUTCDate(), 2)
    +' '+pad(d.getUTCHours(), 2)+':'+pad(d.getUTCMinutes(), 2)
    +':'+pad(d.getUTCSeconds(), 2)
    +'.'+pad(d.getUTCMilliseconds(), 3);
};
E.to_sql_sec = function(d){ return E.to_sql_ms(d).slice(0, -4); };
E.to_sql = function(d){
    return E.to_sql_ms(d).replace(/( 00:00:00)?....$/, ''); };
E.from_sql = E.get;

E.to_month_short = function(d){
    d = E.get(d);
    return E.months_short[d.getUTCMonth()];
};
// timestamp format (used by tickets, etc). dates before 2000 not supported
E.to_jdate = function(d){
    d = E.get(d);
    return (pad(d.getUTCDate(), 2)+'-'+E.months_short[d.getUTCMonth()]
	+'-'+pad(d.getUTCFullYear()%100, 2)+' '+pad(d.getUTCHours(), 2)+
	':'+pad(d.getUTCMinutes(), 2)+':'+pad(d.getUTCSeconds(), 2))
    .replace(/( 00:00)?:00$/, '');
};
// used in log file names
E.to_log_file = function(d){
    d = E.get(d);
    return d.getUTCFullYear()+pad(d.getUTCMonth()+1, 2)+pad(d.getUTCDate(), 2)
    +'_'+pad(d.getUTCHours(), 2)+pad(d.getUTCMinutes(), 2)
    +pad(d.getUTCSeconds(), 2);
};
E.from_log_file = function(d){
    var m = d.match(/^(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})$/);
    if (!m)
        return;
    return new Date(Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
};
// zerr compatible timestamp format
E.to_log_ms = function(d){ return E.to_sql_ms(d).replace(/-/g, '.'); };
E.from_rcs = function(d){
    var m = d.match(/^(\d{4})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})\.(\d{2})$/);
    if (!m)
        return;
    return new Date(Date.UTC(m[1], m[2]-1, m[3], m[4], m[5], m[6]));
};
E.to_rcs = function(d){ return E.to_sql_sec(d).replace(/[-: ]/g, '.'); };

E.sec = {
    MS: 0.001,
    SEC: 1,
    MIN: 60,
    HOUR: 60*60,
    DAY: 24*60*60,
    WEEK: 7*24*60*60,
    MONTH: 30*24*60*60,
    YEAR: 365*24*60*60,
};
E.ms = {};
for (var key in E.sec)
    E.ms[key] = E.sec[key]*1000;
var ms = E.ms;

E.align = function(d, align){
    d = E.get(d, 1);
    switch (align.toUpperCase())
    {
    case 'MS': break;
    case 'SEC': d.setUTCMilliseconds(0); break;
    case 'MIN': d.setUTCSeconds(0, 0); break;
    case 'HOUR': d.setUTCMinutes(0, 0, 0); break;
    case 'DAY': d.setUTCHours(0, 0, 0, 0); break;
    case 'WEEK':
        d.setUTCDate(d.getUTCDate()-d.getUTCDay());
        d.setUTCHours(0, 0, 0, 0);
        break;
    case 'MONTH': d.setUTCDate(1); d.setUTCHours(0, 0, 0, 0); break;
    case 'YEAR': d.setUTCMonth(0, 1); d.setUTCHours(0, 0, 0, 0); break;
    default: throw new Error('invalid align '+align);
    }
    return d;
};

E.add = function(d, duration){
    d = E.get(d, 1);
    if (duration.year)
        d.setUTCFullYear(d.getUTCFullYear()+duration.year);
    if (duration.month)
        d.setUTCMonth(d.getUTCMonth()+duration.month);
    ['day', 'hour', 'min', 'sec', 'ms'].forEach(function(key){
        if (duration[key])
            d.setTime(+d+duration[key]*ms[key.toUpperCase()]);
    });
    return d;
};

E.describe_interval = function(_ms){
    if (_ms<2*ms.MIN)
        return Math.round(_ms/ms.SEC)+' sec';
    if (_ms<2*ms.HOUR)
        return Math.round(_ms/ms.MIN)+' min';
    if (_ms<2*ms.DAY)
        return Math.round(_ms/ms.HOUR)+' hours';
    if (_ms<2*ms.WEEK)
        return Math.round(_ms/ms.DAY)+' days';
    if (_ms<2*ms.MONTH)
        return Math.round(_ms/ms.WEEK)+' weeks';
    if (_ms<2*ms.YEAR)
        return Math.round(_ms/ms.MONTH)+' months';
    return Math.round(_ms/ms.YEAR)+' years';
};

E.time_ago = function(d, until_date){
    var _ms = E.get(until_date)-E.get(d);
    if (_ms<ms.SEC)
        return 'right now';
    return E.describe_interval(_ms)+' ago';
};

E.ms_to_str = function(_ms){
    var s = ''+_ms;
    return s.length<=3 ? s+'ms' : s.slice(0, -3)+'.'+s.slice(-3)+'s';
};

E.parse = function(text, opt){
    opt = opt||{};
    if (opt.fmt)
        return E.strptime(text, opt.fmt);
    var d, a, i, v, _v, dir, _dir, amount, now = opt.now;
    now = !now ? new Date() : new Date(now);
    text = text.replace(/\s+/g, ' ').trim().toLowerCase();
    if (!text)
        return;
    if (text=='now')
        return now;
    if (!isNaN(d = E.get(text)))
        return d;
    d = now;
    a = text.split(' ');
    dir = a.includes('ago') ? -1 : a.includes('last') ? -1 :
        a.includes('next') ? 1 : undefined;
    for (i=0; i<a.length; i++)
    {
        v = a[i];
        if (/^(ago|last|next)$/.test(v));
        else if (v=='today')
            d = E.align(d, 'DAY');
        else if (v=='yesterday')
            d = E.align(+d-ms.DAY, 'DAY');
        else if (v=='tomorrow')
            d = E.align(+d+ms.DAY, 'DAY');
        else if ((_v = days_short_lc.indexOf(v))>=0)
            d = new Date(+E.align(d, 'WEEK')+_v*ms.DAY+(dir||0)*ms.WEEK);
        else if (_v = /^([+-]?\d+)(?:([ymoinwdhs]+)(\d.*)?)?$/.exec(v))
        {
            if (amount!==undefined)
                return;
            amount = dir!==undefined ? Math.abs(+_v[1]) : +_v[1];
            if (_v[2])
            {
                a.splice(i+1, 0, _v[2]);
                if (_v[3])
                    a.splice(i+2, 0, _v[3]);
            }
            continue;
        }
        else if (/^([ywdhs]|years?|months?|mon?|weeks?|days?|hours?|minutes?|min|seconds?|sec)$/.test(v))
        {
            _v = v[0]=='m' && v[1]=='i' ? ms.MIN :
                v[0]=='y' ? ms.YEAR : v[0]=='m' && v[1]=='o' ? ms.MONTH :
                v[0]=='w' ? ms.WEEK :
                v[0]=='d' ? ms.DAY : v[0]=='h' ? ms.HOUR : ms.SEC;
            amount = amount===undefined ? 1 : amount;
            _dir = dir===undefined ? opt.dir||1 : dir;
            if (_v==ms.MONTH)
                d.setUTCMonth(d.getUTCMonth()+_dir*amount);
            else if (_v==ms.YEAR)
                d.setUTCFullYear(d.getUTCFullYear()+_dir*amount);
            else
                d = new Date(+d+_v*amount*_dir);
            amount = undefined;
        }
        else
            return;
        if (amount!==undefined)
            return;
    }
    if (amount!==undefined)
        return;
    return d;
};

E.strptime = function(str, fmt){
    function month(m){ return months_short_lc.indexOf(m.toLowerCase()); }
    var parse = {
        '%': ['%', function(){}, 0],
        a: ['[a-z]+', function(m){}, 0],
        A: ['[a-z]+', function(m){}, 0],
        b: ['[a-z]+', function(m){ d.setUTCMonth(month(m)); }, 2],
        B: ['[a-z]+', function(m){
            d.setUTCMonth(month(m.toLowerCase())); }, 2],
        y: ['[0-9]{2}', function(m){
            d.setUTCFullYear(+m+(m<70 ? 2000 : 1900)); }, 1],
        Y: ['[0-9]{4}', function(m){ d.setUTCFullYear(+m); }, 1],
        m: ['[0-9]{0,2}', function(m){ d.setUTCMonth(+m-1); }, 2],
        d: ['[0-9]{0,2}', function(m){ d.setUTCDate(+m); }, 3],
        H: ['[0-9]{0,2}', function(m){ d.setUTCHours(+m); }, 4],
        M: ['[0-9]{0,2}', function(m){ d.setUTCMinutes(+m); }, 5],
        S: ['[0-9]{0,2}', function(m){ d.setUTCSeconds(+m); }, 6],
        s: ['[0-9]+', function(m){ d = new Date(+m); }, 0],
        L: ['[0-9]{0,3}', function(m){ d.setUTCMilliseconds(+m); }, 7],
        z: ['[+-][0-9]{4}', function(m){
            var timezone = +m.slice(0, 3)*3600+m.slice(3, 5)*60;
            d = new Date(d.getTime()-timezone*1000);
        }, 8],
        Z: ['[a-z]{0,3}[+-][0-9]{2}:?[0-9]{2}|[a-z]{1,3}', function(m){
            m = /^([a-z]{0,3})(?:([+-][0-9]{2}):?([0-9]{2}))?$/i.exec(m);
            if (m[1]=='Z' || m[1]=='UTC')
                return;
            var timezone = +m[2]*3600+m[3]*60;
            d = new Date(d.getTime()-timezone*1000);
        }, 8],
        I: ['[0-9]{0,2}', function(m){ d.setUTCHours(+m); }, 4],
        p: ['AM|PM', function(m){
            if (d.getUTCHours()==12)
                d.setUTCHours(d.getUTCHours()-12);
            if (m.toUpperCase()=='PM')
                d.setUTCHours(d.getUTCHours()+12);
        }, 9],
    };
    var ff = [];
    var ff_idx = [];
    var re = new RegExp('^\\s*'+fmt.replace(/%(?:([a-zA-Z%]))/g,
        function(_, fd)
    {
        var d = parse[fd];
        if (!d)
            throw Error('Unknown format descripter: '+fd);
        ff_idx[d[2]] = ff.length;
        ff.push(d[1]);
        return '('+d[0]+')';
    })+'\\s*$', 'i');
    var matched = str.match(re);
    if (!matched)
        return;
    var d = new Date(0);
    for (var i=0; i<ff_idx.length; i++)
    {
        var idx = ff_idx[i];
        var fun = ff[idx];
        if (fun)
            fun(matched[idx+1]);
    }
    return d;
};

var utc_local = {
    local: {
	getSeconds: function(d){ return d.getSeconds(); },
	getMinutes: function(d){ return d.getMinutes(); },
	getHours: function(d){ return d.getHours(); },
	getDay: function(d){ return d.getDay(); },
	getDate: function(d){ return d.getDate(); },
	getMonth: function(d){ return d.getMonth(); },
	getFullYear: function(d){ return d.getFullYear(); },
	getYearBegin: function(d){ return new Date(d.getFullYear(), 0, 1); }
    },
    utc: {
	getSeconds: function(d){ return d.getUTCSeconds(); },
	getMinutes: function(d){ return d.getUTCMinutes(); },
	getHours: function(d){ return d.getUTCHours(); },
	getDay: function(d){ return d.getUTCDay(); },
	getDate: function(d){ return d.getUTCDate(); },
	getMonth: function(d){ return d.getUTCMonth(); },
	getFullYear: function(d){ return d.getUTCFullYear(); },
	getYearBegin: function(d){ return new Date(Date.UTC(
            d.getUTCFullYear(), 0, 1)); }
    }
};

E.strftime = function(fmt, d, opt){
    function hours12(hours){
        return hours==0 ? 12 : hours>12 ? hours-12 : hours; }
    function ord_str(n){
        var i = n % 10, ii = n % 100;
        if (ii>=11 && ii<=13 || i==0 || i>=4)
            return 'th';
        switch (i)
        {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        }
    }
    function week_num(l, d, first_weekday){
        // This works by shifting the weekday back by one day if we
        // are treating Monday as the first day of the week.
        var wday = l.getDay(d);
        if (first_weekday=='monday')
            wday = wday==0 /* Sunday */ ? wday = 6 : wday-1;
        var yday = (d-l.getYearBegin(d))/ms.DAY;
        return Math.floor((yday + 7 - wday)/7);
    }
    // Default padding is '0' and default length is 2, both are optional.
    function padx(n, padding, length){
        // padx(n, <length>)
        if (typeof padding=='number')
        {
            length = padding;
            padding = '0';
        }
        // Defaults handle padx(n) and padx(n, <padding>)
        if (padding===undefined)
            padding = '0';
        length = length||2;
        var s = ''+n;
        // padding may be an empty string, don't loop forever if it is
        if (padding)
            for (; s.length<length; s = padding + s);
        return s;
    }
    opt = opt||{};
    d = E.get(d);
    var locale = opt.locale||E.locale;
    var formats = locale.formats||{};
    var tz = opt.timezone;
    var utc = opt.utc!==undefined ? opt.utc :
	opt.local!==undefined ? !opt.local :
	true;
    if (tz!=null)
    {
	utc = true;
	// ISO 8601 format timezone string, [-+]HHMM
	// Convert to the number of minutes and it'll be applied to the date
	// below.
	if (typeof tz=='string')
	{
	    var sign = tz[0]=='-' ? -1 : 1;
	    var hours = parseInt(tz.slice(1, 3), 10);
	    var mins = parseInt(tz.slice(3, 5), 10);
	    tz = sign*(60*hours+mins);
	}
        if (typeof tz=='number')
	    d = new Date(+d+tz*60000);
    }
    var l = utc ? utc_local.utc : utc_local.local;
    // Most of the specifiers supported by C's strftime, and some from Ruby.
    // Some other syntax extensions from Ruby are supported: %-, %_, and %0
    // to pad with nothing, space, or zero (respectively).
    function replace(fmt){ return fmt.replace(/%([-_0]?.)/g, function(_, c){
	var mod, padding, day;
	if (c.length==2)
	{
	    mod = c[0];
	    if (mod=='-') // omit padding
		padding = '';
	    else if (mod=='_') // pad with space
		padding = ' ';
	    else if (mod=='0') // pad with zero
		padding = '0';
	    else // unrecognized, return the format
		return _;
	    c = c[1];
	}
	switch (c)
	{
	// Examples for new Date(0) in GMT
	case 'A': return locale.days_long[l.getDay(d)]; // 'Thursday'
	case 'a': return locale.days_short[l.getDay(d)]; // 'Thu'
	case 'B': return locale.months_long[l.getMonth(d)]; // 'January'
	case 'b': return locale.months_short[l.getMonth(d)]; // 'Jan'
	case 'C': // '19'
	    return padx(Math.floor(l.getFullYear(d)/100), padding);
	case 'D': return replace(formats.D || '%m/%d/%y'); // '01/01/70'
	case 'd': return padx(l.getDate(d), padding); // '01'
	case 'e': return l.getDate(d); // '01'
	case 'F': return replace(formats.F || '%Y-%m-%d'); // '1970-01-01'
	case 'H': return padx(l.getHours(d), padding); // '00'
	case 'h': return locale.months_short[l.getMonth(d)]; // 'Jan'
	case 'I': return padx(hours12(l.getHours(d)), padding); // '12'
	case 'j': // '000'
	    day = Math.ceil((+d-l.getYearBegin(d))/(1000*60*60*24));
	    return pad(day, 3);
	case 'k': // ' 0'
	    return padx(l.getHours(d), padding===undefined ? ' ' : padding);
	case 'L': return pad(Math.floor(d.getMilliseconds()), 3); // '000'
	case 'l': // '12'
	    return padx(hours12(l.getHours(d)),
		padding===undefined ? ' ' : padding);
	case 'M': return padx(l.getMinutes(d), padding); // '00'
	case 'm': return padx(l.getMonth(d)+1, padding); // '01'
	case 'n': return '\n'; // '\n'
	case 'o': return ''+l.getDate(d)+ord_str(l.getDate(d)); // '1st'
	case 'P': // 'am'
            return (l.getHours(d)<12 ? locale.AM : locale.PM).toLowerCase();
	case 'p': return l.getHours(d)<12 ? locale.AM : locale.PM; // 'AM'
	case 'R': return replace(formats.R || '%H:%M'); // '00:00'
	case 'r': return replace(formats.r || '%I:%M:%S %p'); // '12:00:00 AM'
	case 'S': return padx(l.getSeconds(d), padding); // '00'
	case 's': return Math.floor(+d/1000); // '0'
	case 'T': return replace(formats.T || '%H:%M:%S'); // '00:00:00'
	case 't': return '\t'; // '\t'
	case 'U': return padx(week_num(l, d, 'sunday'), padding); // '00'
	case 'u': // '4'
	    day = l.getDay(d);
	    // 1 - 7, Monday is first day of the week
	    return day==0 ? 7 : day;
	case 'v': return replace(formats.v || '%e-%b-%Y'); // '1-Jan-1970'
	case 'W': return padx(week_num(l, d, 'monday'), padding); // '00'
	case 'w': return l.getDay(d); // '4'. 0 Sunday - 6 Saturday
	case 'Y': return l.getFullYear(d); // '1970'
	case 'y': return (''+l.getFullYear(d)).slice(-2); // '70'
	case 'Z': // 'GMT'
	    if (utc)
	        return 'GMT';
	    var tz_string = d.toString().match(/\((\w+)\)/);
	    return tz_string && tz_string[1] || '';
	case 'z': // '+0000'
	    if (utc)
	        return '+0000';
	    var off = typeof tz=='number' ? tz : -d.getTimezoneOffset();
	    return (off<0 ? '-' : '+')+pad(Math.abs(off/60), 2)+pad(off%60, 2);
	default: return c;
	}
    }); }
    return replace(fmt);
};

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 128:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DomainTable = exports.DomainRow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('domains', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var DomainRow = function (_React$Component) {
    _inherits(DomainRow, _React$Component);

    function DomainRow() {
        _classCallCheck(this, DomainRow);

        return _possibleConstructorReturn(this, (DomainRow.__proto__ || Object.getPrototypeOf(DomainRow)).apply(this, arguments));
    }

    _createClass(DomainRow, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var class_name = '';
            var click = function click() {};
            if (this.props.go) {
                click = function click() {
                    return window.location = _this3.props.path + '/' + _this3.props.stat.hostname;
                };
                class_name = 'row_clickable';
            }
            return _react2.default.createElement(
                'tr',
                { className: class_name, onClick: click },
                _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                        'a',
                        { href: this.props.path + '/' + this.props.stat.hostname },
                        this.props.stat.hostname
                    )
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_bw },
                    _util2.default.bytes_format(this.props.stat.bw)
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_value },
                    this.props.stat.value
                )
            );
        }
    }]);

    return DomainRow;
}(_react2.default.Component);

var DomainTable = function (_React$Component2) {
    _inherits(DomainTable, _React$Component2);

    function DomainTable() {
        _classCallCheck(this, DomainTable);

        return _possibleConstructorReturn(this, (DomainTable.__proto__ || Object.getPrototypeOf(DomainTable)).apply(this, arguments));
    }

    _createClass(DomainTable, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _common2.default.StatTable,
                _extends({ row: DomainRow, path: '/domains',
                    row_key: 'hostname', go: true }, this.props),
                _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'th',
                        null,
                        'Domain Host'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-2' },
                        'Bandwidth'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-5' },
                        'Number of requests'
                    )
                )
            );
        }
    }]);

    return DomainTable;
}(_react2.default.Component);

var Stats = function (_React$Component3) {
    _inherits(Stats, _React$Component3);

    function Stats(props) {
        _classCallCheck(this, Stats);

        var _this5 = _possibleConstructorReturn(this, (Stats.__proto__ || Object.getPrototypeOf(Stats)).call(this, props));

        _this5.state = { stats: [] };
        return _this5;
    }

    _createClass(Stats, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            if (window.localStorage.getItem('quickstart-test-proxy')) window.localStorage.setItem('quickstart-stats', true);
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _common2.default.StatsService.get_all({ sort: 1,
                                    by: 'hostname' });

                            case 2:
                                res = _context.sent;

                                _this.setState({ stats: res });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'page-header' },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Domains'
                    )
                ),
                _react2.default.createElement(DomainTable, { stats: this.state.stats })
            );
        }
    }]);

    return Stats;
}(_react2.default.Component);

exports.DomainRow = DomainRow;
exports.DomainTable = DomainTable;
exports.default = Stats;

/***/ }),

/***/ 129:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.ProtocolTable = exports.ProtocolRow = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('protocols', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var CertificateButton = function (_React$Component) {
    _inherits(CertificateButton, _React$Component);

    function CertificateButton() {
        _classCallCheck(this, CertificateButton);

        return _possibleConstructorReturn(this, (CertificateButton.__proto__ || Object.getPrototypeOf(CertificateButton)).apply(this, arguments));
    }

    _createClass(CertificateButton, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactBootstrap.Button,
                { bsStyle: this.props.bs_style, bsSize: 'xsmall',
                    onClick: this.props.onClick },
                this.props.text
            );
        }
    }]);

    return CertificateButton;
}(_react2.default.Component);

var ProtocolRow = function (_React$Component2) {
    _inherits(ProtocolRow, _React$Component2);

    function ProtocolRow() {
        var _ref;

        var _temp, _this3, _ret;

        _classCallCheck(this, ProtocolRow);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this3 = _possibleConstructorReturn(this, (_ref = ProtocolRow.__proto__ || Object.getPrototypeOf(ProtocolRow)).call.apply(_ref, [this].concat(args))), _this3), _this3.handle_https_btn_click = function (evt) {
            evt.stopPropagation();
            _this3.props.enable_https_button_click(evt);
        }, _temp), _possibleConstructorReturn(_this3, _ret);
    }

    _createClass(ProtocolRow, [{
        key: 'render_https_button',
        value: function render_https_button() {
            if (this.props.stat.protocol != 'https') return null;
            if (!this.props.show_enable_https_button) return null;
            return _react2.default.createElement(CertificateButton, { bs_style: 'success',
                text: 'Enable HTTPS Statistics',
                onClick: this.handle_https_btn_click });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this4 = this;

            var class_name = '';
            var click = function click() {};
            var https_button = this.render_https_button();
            var value = !https_button || this.props.stat.value != '0' ? this.props.stat.value : '';
            if (this.props.go) {
                click = function click() {
                    return window.location = _this4.props.path + '/' + _this4.props.stat.protocol;
                };
                class_name = 'row_clickable';
            }
            return _react2.default.createElement(
                'tr',
                { className: class_name, onClick: click },
                _react2.default.createElement(
                    'td',
                    null,
                    _react2.default.createElement(
                        'a',
                        { href: this.props.path + '/' + this.props.stat.protocol },
                        this.props.stat.protocol
                    )
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_bw },
                    _util2.default.bytes_format(this.props.stat.bw)
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_value },
                    value,
                    ' ',
                    https_button
                )
            );
        }
    }]);

    return ProtocolRow;
}(_react2.default.Component);

var ProtocolTable = function (_React$Component3) {
    _inherits(ProtocolTable, _React$Component3);

    function ProtocolTable() {
        _classCallCheck(this, ProtocolTable);

        return _possibleConstructorReturn(this, (ProtocolTable.__proto__ || Object.getPrototypeOf(ProtocolTable)).apply(this, arguments));
    }

    _createClass(ProtocolTable, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _common2.default.StatTable,
                _extends({ row: ProtocolRow, path: '/protocols',
                    row_key: 'protocol', title: _react2.default.createElement(
                        _reactBootstrap.Row,
                        null,
                        _react2.default.createElement(
                            _reactBootstrap.Col,
                            { md: 6 },
                            this.props.title
                        ),
                        this.props.show_enable_https_button && _react2.default.createElement(
                            _reactBootstrap.Col,
                            { md: 6, className: 'text-right' },
                            _react2.default.createElement(CertificateButton, { bs_style: 'success',
                                text: 'Enable HTTPS Statistics',
                                onClick: this.props.enable_https_button_click })
                        )
                    ),
                    go: true,
                    row_opts: { show_enable_https_button: this.props.show_enable_https_button, enable_https_button_click: this.props.enable_https_button_click }
                }, this.props),
                _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'th',
                        null,
                        'Protocol'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-2' },
                        'Bandwidth'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-5' },
                        'Number of requests'
                    )
                )
            );
        }
    }]);

    return ProtocolTable;
}(_react2.default.Component);

var Stats = function (_React$Component4) {
    _inherits(Stats, _React$Component4);

    function Stats(props) {
        _classCallCheck(this, Stats);

        var _this6 = _possibleConstructorReturn(this, (Stats.__proto__ || Object.getPrototypeOf(Stats)).call(this, props));

        _this6.state = { stats: [] };
        return _this6;
    }

    _createClass(Stats, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _common2.default.StatsService.get_all({ sort: 1,
                                    by: 'protocol' });

                            case 2:
                                res = _context.sent;

                                _this.setState({ stats: res });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'page-header' },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Protocols'
                    )
                ),
                _react2.default.createElement(ProtocolTable, { stats: this.state.stats })
            );
        }
    }]);

    return Stats;
}(_react2.default.Component);

exports.ProtocolRow = ProtocolRow;
exports.ProtocolTable = ProtocolTable;
exports.default = Stats;

/***/ }),

/***/ 181:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*jslint node:true, browser:true*/
(function(){

var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = {};

var proto_slice = Array.prototype.slice;
E.copy = function(a){
    switch (a.length)
    {
    case 0: return [];
    case 1: return [a[0]];
    case 2: return [a[0], a[1]];
    case 3: return [a[0], a[1], a[2]];
    case 4: return [a[0], a[1], a[2], a[3]];
    case 5: return [a[0], a[1], a[2], a[3], a[4]];
    default: return proto_slice.call(a);
    }
};

E.push = function(a){
    for (var i=1; i<arguments.length; i++)
    {
        var arg = arguments[i];
        if (Array.isArray(arg))
            a.push.apply(a, arg);
        else
            a.push(arg);
    }
    return a.length;
};
E.unshift = function(a){
    for (var i=arguments.length-1; i>0; i--)
    {
        var arg = arguments[i];
        if (Array.isArray(arg))
            a.unshift.apply(a, arg);
        else
            a.unshift(arg);
    }
    return a.length;
};

E.slice = function(args, from, to){
    return Array.prototype.slice.call(args, from, to); };

E.compact = function(a){ return E.compact_self(a.slice()); };
E.compact_self = function(a){
    var i, j, n = a.length;
    for (i=0; i<n && a[i]; i++);
    if (i==n)
	return a;
    for (j=i; i<n; i++)
    {
	if (!a[i])
	    continue;
	a[j++] = a[i];
    }
    a.length = j;
    return a;
};

// same as _.flatten(a, true)
E.flatten_shallow = function(a){ return Array.prototype.concat.apply([], a); };
E.flatten = function(a){
    var _a = [], i;
    for (i=0; i<a.length; i++)
    {
        if (Array.isArray(a[i]))
            Array.prototype.push.apply(_a, E.flatten(a[i]));
        else
            _a.push(a[i]);
    }
    return _a;
};
E.unique = function(a){
    var _a = [];
    for (var i=0; i<a.length; i++)
    {
        if (!_a.includes(a[i]))
            _a.push(a[i]);
    }
    return _a;
};
E.to_nl = function(a, sep){
    if (!a || !a.length)
	return '';
    if (sep===undefined)
	sep = '\n';
    return a.join(sep)+sep;
};
E.sed = function(a, regex, replace){
    var _a = new Array(a.length), i;
    for (i=0; i<a.length; i++)
	_a[i] = a[i].replace(regex, replace);
    return _a;
};
E.grep = function(a, regex, replace){
    var _a = [], i;
    for (i=0; i<a.length; i++)
    {
	// dont use regex.test() since with //g sticky tag it does not reset
	if (a[i].search(regex)<0)
	    continue;
	if (replace!==undefined)
	    _a.push(a[i].replace(regex, replace));
	else
	    _a.push(a[i]);
    }
    return _a;
};

E.rm_elm = function(a, elm){
    var i = a.indexOf(elm);
    if (i<0)
	return;
    a.splice(i, 1);
    return elm;
};

E.rm_elm_tail = function(a, elm){
    var i = a.length-1;
    if (elm===a[i]) // fast-path
    {
	a.pop();
	return elm;
    }
    if ((i = a.lastIndexOf(elm, i-1))<0)
	return;
    a.splice(i, 1);
    return elm;
};

E.add_elm = function(a, elm){
    if (a.includes(elm))
        return;
    a.push(elm);
    return elm;
};

E.split_every = function(a, n){
    var ret = [];
    for (var i=0; i<a.length; i+=n)
        ret.push(a.slice(i, i+n));
    return ret;
};

E.split_at = function(a, delim){
    var ret = [];
    delim = delim||'';
    for (var i=0; i<a.length; i++)
    {
        var chunk = [];
        for (; i<a.length && a[i]!=delim; i++)
            chunk.push(a[i]);
        if (chunk.length)
            ret.push(chunk);
    }
    return ret;
};

E.rotate = function(a, n){
    if (a && a.length>1 && (n = n%a.length))
        E.unshift(a, a.splice(n));
    return a;
};

E.move = function(a, from, to, n){
    return Array.prototype.splice.apply(a, [to, n]
        .concat(a.slice(from, from+n)));
};

E.to_array = function(v){ return Array.isArray(v) ? v : v==null ? [] : [v]; };

var proto = {};
proto.sed = function(regex, replace){
    return E.sed(this, regex, replace); };
proto.grep = function(regex, replace){
    return E.grep(this, regex, replace); };
proto.to_nl = function(sep){ return E.to_nl(this, sep); };
proto.push_a = function(){
    return E.push.apply(null, [this].concat(Array.from(arguments))); };
proto.unshift_a = function(){
    return E.unshift.apply(null, [this].concat(Array.from(arguments))); };
var installed;
E.prototype_install = function(){
    if (installed)
        return;
    installed = true;
    for (var i in proto)
    {
        Object.defineProperty(Array.prototype, i,
            {value: proto[i], configurable: true, enumerable: false,
            writable: true});
    }
};
E.prototype_uninstall = function(){
    if (!installed)
        return;
    installed = false;
    // XXX sergey: store orig proto, then load it back
    for (var i in proto)
        delete Array.prototype[i];
};
return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 289:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){
var  node_util;
var is_node = typeof module=='object' && module.exports && module.children;
var is_ff_addon = typeof module=='object' && module.uri
    && !module.uri.indexOf('resource://');
if (is_ff_addon)
    ;
else if (!is_node)
    ;
else
{
    node_util = require('util');
    ;
}
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(181)], __WEBPACK_AMD_DEFINE_RESULT__ = function(array){
var E = {};

E._is_mocha = undefined;
E.is_mocha = function(){
    if (E._is_mocha!==undefined)
        return E._is_mocha;
    if (typeof process!='undefined')
        return E._is_mocha = process.env.IS_MOCHA||false;
    return E._is_mocha = false;
};

E.is_lxc = function(){ return is_node && +process.env.LXC; };

E.f_mset = function(flags, mask, bits){ return (flags &~ mask) | bits; };
E.f_lset = function(flags, bits, logic){
    return E.f_mset(flags, bits, logic ? bits : 0); };
E.f_meq = function(flags, mask, bits){ return (flags & mask)==bits; };
E.f_eq = function(flags, bits){ return (flags & bits)==bits; };
E.f_cmp = function(f1, f2, mask){ return (f1 & mask)==(f2 & mask); };
E.xor = function(a, b){ return !a != !b; };
E.div_ceil = function(a, b){ return Math.floor((a+b-1)/b); };
E.ceil_mul = function(a, b){ return E.div_ceil(a, b)*b; };
E.floor_mul = function(a, b){ return Math.floor(a/b)*b; };

E.range = function(x, a, b){ return x>=a && x<=b; };
E.range.ii = function(x, a, b){ return x>=a && x<=b; };
E.range.ie = function(x, a, b){ return x>=a && x<b; };
E.range.ei = function(x, a, b){ return x>a && x<=b; };
E.range.ee = function(x, a, b){ return x>a && x<b; };

E.clamp = function(lower_bound, value, upper_bound){
    if (value < lower_bound)
        return lower_bound;
    if (value < upper_bound)
        return value;
    return upper_bound;
};

/* Union given objects, using fn to resolve conflicting keys */
E.union_with = function(fn /*[o1, [o2, [...]]]*/){
    var res = {}, args;
    if (arguments.length==2 && typeof arguments[1]=='object')
        args = arguments[1];
    else
        args = array.slice(arguments, 1);
    for (var i = 0; i < args.length; ++i)
    {
        for (var key in args[i])
	{
	    var arg = args[i];
	    res[key] = res.hasOwnProperty(key) ? fn(res[key], arg[key])
		: arg[key];
	}
    }
    return res;
};

function _clone_deep(obj){
    var i, n, ret;
    if (obj instanceof Array)
    {
	ret = new Array(obj.length);
	n = obj.length;
	for (i = 0; i < n; i++)
	    ret[i] = obj[i] instanceof Object ? _clone_deep(obj[i]): obj[i];
	return ret;
    }
    else if (obj instanceof Date)
	return new Date(obj);
    else if (obj instanceof RegExp)
	return new RegExp(obj);
    // XXX romank: properly clone function
    else if (obj instanceof Function)
        return obj;
    ret = {};
    for (i in obj)
	ret[i] = obj[i] instanceof Object ? _clone_deep(obj[i]) : obj[i];
    return ret;
}

E.clone_deep = function(obj){
    if (!(obj instanceof Object))
	return obj;
    return _clone_deep(obj);
};

// prefer to normally Object.assign() instead of extend()
E.extend = function(obj){ // like _.extend
    for (var i=1; i<arguments.length; i++)
    {
	var source = arguments[i];
	if (!source)
	    continue;
        for (var prop in source)
	    obj[prop] = source[prop];
    }
    return obj;
};

function is_object(obj){
    return obj && obj.constructor==Object; }

E.extend_deep = function(obj){
    for (var i=1; i<arguments.length; i++)
    {
        var source = arguments[i];
        if (!source)
            continue;
        for (var prop in source)
        {
            if (is_object(source[prop]) && is_object(obj[prop]))
                E.extend_deep(obj[prop], source[prop]);
            else
                obj[prop] = source[prop];
        }
    }
    return obj;
};
E.extend_deep_del_null = function(obj){
    for (var i=1; i<arguments.length; i++)
    {
        var source = arguments[i];
        if (!source)
            continue;
        for (var prop in source)
        {
            if (is_object(source[prop]))
            {
                if (!is_object(obj[prop]))
                    obj[prop] = {};
                E.extend_deep_del_null(obj[prop], source[prop]);
            }
            else if (source[prop]==null)
                delete obj[prop];
            else
                obj[prop] = source[prop];
        }
    }
    return obj;
};

E.clone = function(obj){ // like _.clone
    if (!(obj instanceof Object))
	return obj;
    if (obj instanceof Array)
    {
	var a = new Array(obj.length);
	for (var i=0; i<obj.length; i++)
	    a[i] = obj[i];
	return a;
    }
    return E.extend({}, obj);
};

// like _.map() except returns object, not array
E.map_obj = function(obj, fn){
    var ret = {};
    for (var i in obj)
        ret[i] = fn(obj[i], i, obj);
    return ret;
};

// recursivelly recreate objects with keys added in order
E.sort_obj = function(obj){
    if (obj instanceof Array || !(obj instanceof Object))
	return obj;
    var ret = {}, keys = Object.keys(obj).sort();
    for (var i=0; i<keys.length; i++)
	ret[keys[i]] = E.sort_obj(obj[keys[i]]);
    return ret;
};

// an Object equivalent of Array.prototype.forEach
E.forEach = function(obj, fn, _this){
    for (var i in obj)
        fn.call(_this, obj[i], i, obj);
};
// an Object equivalent of Array.prototype.find
E.find = function(obj, fn, _this){
    for (var i in obj)
    {
        if (fn.call(_this, obj[i], i, obj))
            return obj[i];
    }
};
E.find_prop = function(obj, prop, val){
    return E.find(obj, function(o){ return o[prop]===val; }); };
E.isspace = function(c){ return /\s/.test(c); };
E.isdigit = function(c){ return c>='0' && c<='9'; };
E.isalpha = function(c){ return (c>='a' && c<='z') || (c>='A' && c<='Z'); };
E.isalnum = function(c){ return E.isdigit(c)||E.isalpha(c); };

E.obj_pluck = function(obj, prop){
    var val = obj[prop];
    delete obj[prop];
    return val;
};

// Object.keys() does not work on prototype
E.proto_keys = function(proto){
    var keys = [];
    for (var i in proto)
	keys.push(i);
    return keys;
};

E.values = function(obj){
    var values = [];
    for (var i in obj)
        values.push(obj[i]);
    return values;
};

E.path = function(path){
    if (Array.isArray(path))
        return path;
    path = ''+path;
    if (!path)
        return [];
    return path.split('.');
};
E.get = function(o, path, def){
    path = E.path(path);
    for (var i=0; i<path.length; i++)
    {
	if (!o || !(path[i] in o))
	    return def;
	o = o[path[i]];
    }
    return o;
};
E.set = function(o, path, value){
    path = E.path(path);
    for (var i=0; i<path.length-1; i++)
    {
        var p = path[i];
        o = o[p] || (o[p] = {});
    }
    o[path[path.length-1]] = value;
};
var has_unique = {};
E.has = function(o, path){ return E.get(o, path, has_unique)!==has_unique; };
E.own = function(o, prop){
    return Object.prototype.hasOwnProperty.call(o, prop); };

E.bool_lookup = function(a, split){
    var ret = {}, i;
    if (typeof a=='string')
	a = a.split(split||/\s/);
    for (i=0; i<a.length; i++)
	ret[a[i]] = true;
    return ret;
};

E.clone_inplace = function(dst, src){
    if (dst===src)
        return dst;
    if (Array.isArray(dst))
    {
        for (var i=0; i<src.length; i++)
            dst[i] = src[i];
        dst.splice(src.length);
    }
    else if (typeof dst=='object')
    {
        for (var k in src)
            dst[k] = src[k];
        for (k in dst)
        {
            if (!src.hasOwnProperty(k))
                delete dst[k];
        }
    }
    return dst;
};

if (node_util)
    E.inherits = node_util.inherits;
else
{
    // implementation from node.js 'util' module
    E.inherits = function inherits(ctor, superCtor){
	ctor.super_ = superCtor;
	ctor.prototype = Object.create(superCtor.prototype,
            {constructor: {value: ctor, enumerable: false, writable: true,
	    configurable: true}});
    };
}

// ctor must only have one prototype level
// XXX vladislav: ES6 class is not supported for ctor
E.inherit_init = function(obj, ctor, params){
    var orig_proto = Object.getPrototypeOf(obj);
    var ctor_proto = Object.assign({}, ctor.prototype);
    Object.setPrototypeOf(ctor_proto, orig_proto);
    Object.setPrototypeOf(obj, ctor_proto);
    return ctor.apply(obj, params);
};

E.pick = function(obj){
    var i, o = {};
    for (i=1; i<arguments.length; i++)
    {
        if (E.own(obj, arguments[i]))
            o[arguments[i]] = obj[arguments[i]];
    }
    return o;
};

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 296:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){

var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(21), __webpack_require__(33), __webpack_require__(105), __webpack_require__(326),
    __webpack_require__(678), __webpack_require__(681)], __WEBPACK_AMD_DEFINE_RESULT__ = function($, etask, date, zescape, zerr, events){
var E = ajax;
var assign = Object.assign;
E.events = new events.EventEmitter();
E.json = function(opt){ return ajax(assign({}, opt, {json: 1})); };
E.abort = function(ajax){ ajax.goto('abort'); };
// XXX arik: need test
function ajax(opt){
    var timeout = opt.timeout||20*date.ms.SEC, slow = opt.slow||2*date.ms.SEC;
    var retry = opt.retry, data = opt.data, qs = zescape.qs(opt.qs);
    var url = zescape.uri(opt.url, qs), perr = opt.perr;
    // opt.type is deprecated
    var method = opt.method||opt.type||'GET';
    var data_type = opt.json ? 'json' : 'text';
    var t0 = Date.now();
    var xhr;
    zerr.debug('ajax('+data_type+') url '+url+' retry '+retry);
    return etask([function(){
        var ajopt = {dataType: data_type, type: method, url: url,
            data: data, timeout: timeout, xhrFields: {}};
        if (opt.with_credentials)
            ajopt.xhrFields.withCredentials = true;
        if (opt.onprogress)
            ajopt.xhrFields.onprogress = opt.onprogress;
        return xhr = $.ajax(ajopt);
    }, function catch$(err){
        zerr('ajax('+data_type+') failed url '+url+' data '+
            zerr.json(data).substr(0, 200)+' status: '+xhr.status+' '+
            xhr.statusText+'\nresponseText: '+
            (xhr.responseText||'').substr(0, 200));
        if (retry)
            return this.return(ajax(assign({}, opt, {retry: retry-1})));
        if (xhr.statusText=='timeout')
            E.events.emit('timeout', this);
        if (opt.no_throw)
            return {error: xhr.statusText||'no_status'};
        throw new Error(xhr.statusText);
    }, function(data){
        var t = Date.now()-t0;
        zerr[t>slow ? 'err' : 'debug'](
            'ajax('+data_type+') '+(t>slow ? 'SLOW ' : 'ok ')+t+'ms url '+url);
        if (t>slow && perr)
            perr({id: 'be_ajax_slow', info: t+'ms '+url});
        if (E.do_op)
            E.do_op(data&&data.do_op);
        return this.return(data);
    }, function abort(){
        // reachable only via E.abort
        xhr.abort();
    }]);
}

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 326:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*jslint node:true, browser:true*/
(function(){

var if_node_ff = typeof module=='object' && module.exports;
if (!if_node_ff)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = {};
E.un = {};

var html_escape_table = {
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'};
E.html = function(html){
    return html.replace(/[&<>"']/g, function(m){
	return html_escape_table[m[0]]; });
};

E.sh = function(s_or_a){
    function single(s){
        s = ''+s; // supports also numbers
        if (!s)
            return '""';
        if (/^[a-z0-9_\-.\/:]+$/i.test(s))
            return s;
        return '"'+s.replace(/([\\"`$])/g, '\\$1')+'"';
    }
    if (arguments.length==1 && !Array.isArray(s_or_a))
        return single(s_or_a);
    var s = '', a = Array.isArray(s_or_a) ? s_or_a : arguments;
    for (var i=0; i<a.length; i++)
	s += (i ? ' ' : '')+single(a[i]);
    return s;
};

E.un_sh = function(s, keep_esc){
    var state = {PARSE_STATE_INIT: 0, PARSE_STATE_NORMAL_ARG: 1,
        PARSE_STATE_QUOTE_ARG: 2}, cur_state = state.PARSE_STATE_INIT;
    var i, quote = 0, argv = [], a = '';
    for (i=0; i<s.length; i++)
    {
	var esc = 0;
	a += s[i];
        if (s[i]=='\\' && s[1])
	{
	    if (!keep_esc)
		a = a.slice(0, -1);
	    esc = 1;
	    i++;
	    a += s[i];
        }
        switch (cur_state)
        {
        case state.PARSE_STATE_INIT:
            switch (s[i])
            {
	    case '\r': case '\n': case ' ': case '\t':
		if (!esc)
		{
		    a = '';
		    break;
		}
                /*jslint -W086*/ // fall through
            case '"': case '\'':
                if (!esc)
                {
                    cur_state = state.PARSE_STATE_QUOTE_ARG;
		    if (!keep_esc)
			a = a.slice(0, -1);
                    quote = s[i];
                    break;
                }
                /*jslint -W086*/ // fall through
            default: cur_state = state.PARSE_STATE_NORMAL_ARG;
            }
            break;
        case state.PARSE_STATE_NORMAL_ARG:
            switch (s[i])
            {
	    case '\r': case '\n': case ' ': case '\t':
		if (!esc)
		{
                    cur_state = state.PARSE_STATE_INIT;
		    a = a.slice(0, -1);
		    argv.push(a);
		    a = '';
		}
		break;
	    case '"': case '\'':
                if (!esc)
                {
		    cur_state = state.PARSE_STATE_QUOTE_ARG;
                    quote = s[i];
		    if (!keep_esc)
		        a = a.slice(0, -1);
                }
		break;
            }
            break;
        case state.PARSE_STATE_QUOTE_ARG:
            if (s[i]==quote && !esc)
            {
		cur_state = state.PARSE_STATE_NORMAL_ARG;
		if (!keep_esc)
		    a = a.slice(0, -1);
            }
            break;
        }
    }
    if (cur_state==state.PARSE_STATE_NORMAL_ARG)
    {
	cur_state = state.PARSE_STATE_INIT;
	argv.push(a);
    }
    if (cur_state!=state.PARSE_STATE_INIT)
	throw 'error parsing shell';
    return argv;
};

E.regex = function(s){ return s.replace(/[[\]{}()*+?.\\^$|\/]/g, '\\$&'); };

E.uri_comp = function(s){ return encodeURIComponent(s).replace(/%20/g, '+'); };

var http_escape_chars = [];
(function(){
    var i;
    for (i=0; i<256; i++)
    {
	var c = String.fromCharCode(i);
	http_escape_chars[i] = /^[a-zA-Z0-9_.~,\-]$/.test(c) ? c :
	    '%'+('0'+i.toString(16)).slice(-2);
    }
}());
E.encodeURIComponent_bin = function(s_or_b){
    // Browser does not have Buffer Object
    var s = Buffer && s_or_b instanceof Buffer ? s_or_b.toString('binary')
	: ''+s_or_b;
    var esc = '';
    for (var i = 0; i < s.length; i++)
	esc += http_escape_chars[s.charCodeAt(i)];
    return esc;
};

E.qs = function(param, opt){
    opt = opt||{};
    var qs = opt.qs||'';
    var sep = qs || opt.amp ? '&' : '';
    if (!param)
        return qs;
    var uri_comp = opt.space_plus===undefined || opt.space_plus ? E.uri_comp
        : encodeURIComponent;
    var uri_comp_val = opt.bin ? E.encodeURIComponent_bin : uri_comp;
    for (var i in param)
    {
	var val = param[i];
	if (val===undefined)
	    continue;
        var key = uri_comp(i);
        qs += sep;
        if (val===null)
            qs += key;
        else if (Array.isArray(val))
        {
            if (!val.length)
                continue;
            qs += val.map(function(val){ return key+'='+uri_comp_val(val); })
                .join('&');
        }
        else
            qs += key+'='+uri_comp_val(val);
	sep = '&';
    }
    return qs;
};

// uri(opt)
// uri(uri, qs, hash)
E.uri = function(uri, qs, hash){
    var opt;
    if (typeof uri=='string')
        opt = {uri: uri, _qs: qs, hash: hash};
    else
    {
        opt = Object.assign({}, uri);
        opt._qs = opt.qs;
        opt.qs = undefined;
    }
    uri = opt.uri;
    qs = typeof opt._qs=='string' ? opt._qs : E.qs(opt._qs, opt);
    hash = typeof opt.hash=='string' ? opt.hash : E.qs(opt.hash, opt);
    if (qs)
    {
        if (!uri.includes('?'))
            uri += '?';
        else if (uri[uri.length-1]!='?' && uri[uri.length-1]!='&')
            uri += '&';
    }
    else
        qs = '';
    if (hash)
        hash = '#'+hash;
    else
        hash = '';
    return uri+qs+hash;
};

E.mailto_url = function(mail){
    return 'mailto:'+(mail.to||'')+'?'
    +E.qs({cc: mail.cc, bcc: mail.bcc, subject: mail.subject, body: mail.body},
	{space_plus: false});
};

E.parse = {}; // should this move to parse.js?
E.parse.eat_token = function(s_obj, re){
    var match;
    if (!(match = re.exec(s_obj.s)))
	return match;
    s_obj.s = s_obj.s.substr(match.index+match[0].length);
    return match;
};

E.parse.http_words = function(val){
    // Translation from perl:
    // http://search.cpan.org/~gaas/HTTP-Message-6.06/lib/HTTP/Headers/Util.pm
    var res = [], o = {s: val}, eat_token = E.parse.eat_token, match;
    while (o.s)
    {
	// 'token' or parameter 'attribute'
	if (match = eat_token(o, /^\s*(=*[^\s=;,]+)/))
	{
	    var v = match[1];
	    // a quoted value
	    if (match = eat_token(o, /^\s*=\s*\"([^\"\\]*(?:\\.[^\"\\]*)*)\"/))
		res.push([v, match[1].replace(/\\(.)/, '$1')]);
	    // some unquoted value
	    else if (match = eat_token(o, /^\s*=\s*([^;,\s]*)/))
		res.push([v, match[1].replace(/\s+$/, '')]);
	    // no value, a lone token
	    else
		res.push([v, null]);
	}
	else if (match = eat_token(o, /^\s*,/));
	else if ((match = eat_token(o, /^\s*;/)) || (match = eat_token(o,
	    /^\s+/)));
	else
	    throw new Error('This should not happen: '+o.s);
    }
    return res;
};

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 327:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

__webpack_require__(682);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _prismjs = __webpack_require__(684);

var _prismjs2 = _interopRequireDefault(_prismjs);

var _instructions = __webpack_require__(685);

var _instructions2 = _interopRequireDefault(_instructions);

var _common = __webpack_require__(64);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ga_event = _util2.default.ga_event;

var Howto = function (_React$Component) {
    _inherits(Howto, _React$Component);

    function Howto(props) {
        _classCallCheck(this, Howto);

        var _this = _possibleConstructorReturn(this, (Howto.__proto__ || Object.getPrototypeOf(Howto)).call(this, props));

        _this.state = {};
        return _this;
    }

    _createClass(Howto, [{
        key: 'render_children',
        value: function render_children() {
            var _this2 = this;

            return _react2.default.Children.map(this.props.children, function (child) {
                return _react2.default.cloneElement(child, {
                    on_click: child.props.on_click(_this2.state.option) });
            });
        }
    }, {
        key: 'choose_click',
        value: function choose_click(option) {
            if (this.props.ga_category == 'onboarding') ga_event('lpm-onboarding', '06 select code/browser', option);else if (this.props.ga_category == 'how-to-use') ga_event('How-to-tab', 'select code/browser', option);
            this.setState({ option: option });
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            var subheader = void 0;
            if (this.state.option) subheader = 'using ' + this.state.option;
            var Instructions = function Instructions() {
                return null;
            };
            if (this.state.option == 'browser') Instructions = Browser_instructions;else if (this.state.option == 'code') Instructions = Code_instructions;
            return _react2.default.createElement(
                'div',
                { className: 'intro lpm' },
                _react2.default.createElement(
                    'div',
                    { className: 'howto' },
                    _react2.default.createElement(
                        'h1',
                        { className: 'header' },
                        'Make your first request'
                    ),
                    _react2.default.createElement(Subheader, { value: subheader }),
                    _react2.default.createElement(
                        'div',
                        { className: 'choices' },
                        _react2.default.createElement(Choice, { option: 'Browser',
                            selected: this.state.option == 'browser',
                            on_click: function on_click() {
                                return _this3.choose_click('browser');
                            } }),
                        _react2.default.createElement(
                            'div',
                            { className: 'text_middle' },
                            'or'
                        ),
                        _react2.default.createElement(Choice, { option: 'Code',
                            selected: this.state.option == 'code',
                            on_click: function on_click() {
                                return _this3.choose_click('code');
                            } })
                    ),
                    _react2.default.createElement(
                        Instructions,
                        { ga_cat: this.props.ga_category },
                        this.props.children
                    ),
                    this.state.option ? this.render_children() : null
                )
            );
        }
    }]);

    return Howto;
}(_react2.default.Component);

var Subheader = function Subheader(props) {
    return props.value ? _react2.default.createElement(
        'h1',
        { className: 'sub_header' },
        props.value
    ) : null;
};

var Lang_btn = function Lang_btn(props) {
    var class_names = 'btn btn_lpm btn_lpm_default btn_lpm_small btn_lang' + (props.active ? ' active' : '');
    return _react2.default.createElement(
        'button',
        { className: class_names },
        props.text
    );
};

var Code_instructions = function (_React$Component2) {
    _inherits(Code_instructions, _React$Component2);

    function Code_instructions(props) {
        _classCallCheck(this, Code_instructions);

        var _this4 = _possibleConstructorReturn(this, (Code_instructions.__proto__ || Object.getPrototypeOf(Code_instructions)).call(this, props));

        _this4.state = { lang: 'shell' };
        _this4.category = 'lpm-code-examples' + '-' + _this4.props.ga_cat;
        return _this4;
    }

    _createClass(Code_instructions, [{
        key: 'click_lang',
        value: function click_lang(lang) {
            this.setState({ lang: lang });
            ga_event(this.category, 'selected option', lang);
        }
    }, {
        key: 'click_copy',
        value: function click_copy(lang) {
            ga_event(this.category, 'click copy', lang);
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            var Lang_btn_clickable = function Lang_btn_clickable(props) {
                return _react2.default.createElement(
                    'span',
                    { onClick: function onClick() {
                            return _this5.click_lang(props.lang);
                        } },
                    _react2.default.createElement(Lang_btn, _extends({ active: _this5.state.lang == props.lang }, props))
                );
            };
            var tutorial_port = window.localStorage.getItem('quickstart-first-proxy') || 24000;
            var code = _prismjs2.default.highlight(_instructions2.default.code(tutorial_port)[this.state.lang], _prismjs2.default.languages.clike);
            return _react2.default.createElement(
                'div',
                { className: 'code_instructions' },
                _react2.default.createElement(
                    'div',
                    { className: 'well header_well' },
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'shell', text: 'Shell' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'node', text: 'Node.js' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'java', text: 'Java' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'csharp', text: 'C#' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'vb', text: 'VB' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'php', text: 'PHP' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'python', text: 'Python' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'ruby', text: 'Ruby' }),
                    _react2.default.createElement(Lang_btn_clickable, { lang: 'perl', text: 'Perl' })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'well instructions_well' },
                    _react2.default.createElement(
                        'pre',
                        null,
                        _react2.default.createElement(
                            'code',
                            null,
                            _react2.default.createElement(
                                _common.Code,
                                { id: this.state.lang,
                                    on_click: function on_click() {
                                        return _this5.click_copy(_this5.state.lang);
                                    } },
                                _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: code } })
                            )
                        )
                    )
                )
            );
        }
    }]);

    return Code_instructions;
}(_react2.default.Component);

var Browser_instructions = function (_React$Component3) {
    _inherits(Browser_instructions, _React$Component3);

    function Browser_instructions(props) {
        _classCallCheck(this, Browser_instructions);

        var _this6 = _possibleConstructorReturn(this, (Browser_instructions.__proto__ || Object.getPrototypeOf(Browser_instructions)).call(this, props));

        _this6.state = { browser: 'chrome_win' };
        _this6.category = 'lpm-browser-examples' + '-' + _this6.props.ga_cat;
        _this6.port = window.localStorage.getItem('quickstart-first-proxy') || 24000;
        return _this6;
    }

    _createClass(Browser_instructions, [{
        key: 'browser_changed',
        value: function browser_changed(e) {
            var browser = e.target.value;
            this.setState({ browser: browser });
            ga_event(this.category, 'select option', browser);
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                { className: 'browser_instructions' },
                _react2.default.createElement(
                    'div',
                    { className: 'well header_well' },
                    _react2.default.createElement(
                        'p',
                        null,
                        'Choose browser'
                    ),
                    _react2.default.createElement(
                        'select',
                        { onChange: this.browser_changed.bind(this) },
                        _react2.default.createElement(
                            'option',
                            { value: 'chrome_win' },
                            'Chrome Windows'
                        ),
                        _react2.default.createElement(
                            'option',
                            { value: 'chrome_mac' },
                            'Chrome Mac'
                        ),
                        _react2.default.createElement(
                            'option',
                            { value: 'ie' },
                            'Internet Explorer'
                        ),
                        _react2.default.createElement(
                            'option',
                            { value: 'firefox' },
                            'Firefox'
                        ),
                        _react2.default.createElement(
                            'option',
                            { value: 'safari' },
                            'Safari'
                        )
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'well instructions_well' },
                    _react2.default.createElement(
                        'div',
                        { className: 'instructions' },
                        _instructions2.default.browser(this.port)[this.state.browser]
                    )
                )
            );
        }
    }]);

    return Browser_instructions;
}(_react2.default.Component);

var Choice = function Choice(props) {
    var c = 'choice' + (props.selected ? ' active' : '');
    return _react2.default.createElement(
        'div',
        { className: c, onClick: props.on_click },
        _react2.default.createElement(
            'div',
            { className: 'content' },
            _react2.default.createElement(
                'div',
                { className: 'text_smaller' },
                'Using'
            ),
            _react2.default.createElement(
                'div',
                { className: 'text_bigger' },
                props.option
            )
        )
    );
};

exports.default = Howto;

/***/ }),

/***/ 33:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*jslint node:true, browser:true*/
(function(){
var  process, zerr, assert;
var is_node = typeof module=='object' && module.exports && module.children;
var is_ff_addon = typeof module=='object' && module.uri
    && !module.uri.indexOf('resource://');
if (!is_node)
{
    if (is_ff_addon)
        ;
    else
        ;
    process = {
        nextTick: function(fn){ setTimeout(fn, 0); },
        env: {},
    };
    assert = function(){}; // XXX romank: add proper assert
    // XXX romank: use zerr.js
    // XXX bahaa: require bext/pub/zerr.js for extensions
    if (!is_ff_addon && self.hola && self.hola.zerr)
        zerr = self.hola.zerr;
    else
    {
        zerr = function(){ console.log.apply(console, arguments); };
        zerr.perr = zerr;
        zerr.debug = function(){};
        zerr.is = function(){ return false; };
        zerr.L = {DEBUG: 0};
    }
    if (!zerr.is)
        zerr.is = function(){ return false; };
}
else
{
    require('./config.js');
    process = global.process||require('_process');
    zerr = require('./zerr.js');
    assert = require('assert');
    ;
}
// XXX yuval: /util/events.js -> events when node 6 (support prependListener)
// is here
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(616), __webpack_require__(181), __webpack_require__(289)], __WEBPACK_AMD_DEFINE_RESULT__ = function(events, array, zutil){
var E = Etask;
var etask = Etask;
var env = process.env, assign = Object.assign;
E.use_bt = +env.ETASK_BT;
E.root = [];
E.assert_extra = +env.ETASK_ASSERT_EXTRA; // to debug internal etask bugs
E.nextTick = process.nextTick;
// XXX arik/romank: hack, rm set_zerr, get zerzerrusing require
E.set_zerr = function(_zerr){ zerr = _zerr; };
E.events = new events();
var cb_pre, cb_post, longcb_ms, perf_enable;
E.perf_stat = {};
function _cb_pre(et){ return {start: Date.now()}; }
function _cb_post(et, ctx){
    var ms = Date.now()-ctx.start;
    if (longcb_ms && ms>longcb_ms)
    {
        zerr('long cb '+ms+'ms: '+et.get_name()+', '
            +et.run_state.f.toString().slice(0, 128));
    }
    if (perf_enable)
    {
        var name = et.get_name();
        var perf = E.perf_stat[name]||(E.perf_stat[name] = {ms: 0, n: 0});
        perf.ms += ms;
        perf.n++;
    }
}
function cb_set(){
    if (longcb_ms || perf_enable)
    {
        cb_pre = _cb_pre;
        cb_post = _cb_post;
    }
    else
        cb_pre = cb_post = undefined;
}
E.longcb = function(ms){
    longcb_ms = ms;
    cb_set();
};
E.perf = function(enable){
    perf_enable = enable;
    cb_set();
};
E.longcb(+env.LONGCB);
E.perf(+env.ETASK_PERF);

function stack_get(){
    // new Error(): 200K per second
    // http://jsperf.com/error-generation
    // Function.caller (same as arguments.callee.caller): 2M per second
    // http://jsperf.com/does-function-caller-affect-preformance
    // http://jsperf.com/the-arguments-object-s-effect-on-speed/2
    var prev = Error.stackTraceLimit, err;
    Error.stackTraceLimit = 4;
    err = new Error();
    Error.stackTraceLimit = prev;
    return err;
}

function Etask(opt, states){
    if (!(this instanceof Etask))
        return new Etask(opt, states);
    if (Array.isArray(opt) || typeof opt=='function')
    {
        states = opt;
        opt = undefined;
    }
    opt = (typeof opt=='string' && {name: opt})||opt||{};
    if (typeof states=='function')
    {
        if (states.constructor.name=='GeneratorFunction')
            return E._generator(null, states, opt);
        states = [states];
    }
    // performance: set all fields to undefined
    this.cur_state = this.states = this._finally = this.error =
    this.at_return = this.next_state = this.use_retval = this.running =
    this.at_continue = this.cancel = this.wait_timer = this.retval =
    this.run_state = this._stack = this.down = this.up = this.child =
    this.name = this._name = this.parent = this.cancelable =
    this.tm_create = this._alarm = this.tm_completed = this.parent_type =
    this.info = this.then_waiting = this.free = this.parent_guess =
    this.child_guess = this.wait_retval = undefined;
    // init fields
    this.name = opt.name;
    this._name = this.name===undefined ? 'noname' : this.name;
    this.cancelable = opt.cancel;
    this.then_waiting = [];
    this.child = [];
    this.child_guess = [];
    this.cur_state = -1;
    this.states = [];
    this._stack = Etask.use_bt ? stack_get() : undefined;
    this.tm_create = Date.now();
    this.info = {};
    var idx = this.states.idx = {};
    for (var i=0; i<states.length; i++)
    {
        var pstate = states[i], t;
        if (typeof pstate!='function')
            assert(0, 'invalid state type');
        t = this._get_func_type(pstate);
        var state = {f: pstate, label: t.label, try_catch: t.try_catch,
            catch: t.catch, finally: t.finally, cancel: t.cancel,
            sig: undefined};
        if (i==0 && opt.state0_args)
        {
            state.f = state.f.bind.apply(state.f,
                [this].concat(opt.state0_args));
        }
        if (state.label)
            idx[state.label] = i;
        assert((state.catch||state.try_catch?1:0)
            +(state.finally?1:0)+(state.cancel?1:0)<=1,
            'invalid multiple state types');
        state.sig = state.finally||state.cancel;
        if (state.finally)
        {
            assert(this._finally===undefined, 'more than 1 finally$');
            this._finally = i;
        }
        if (state.cancel)
        {
            assert(this.cancel===undefined, 'more than 1 cancel$');
            this.cancel = i;
        }
        this.states[i] = state;
    }
    var _this = this;
    E.root.push(this);
    var in_run = E.in_run_top();
    if (opt.spawn_parent)
        this.spawn_parent(opt.spawn_parent);
    else if (opt.up)
        opt.up._set_down(this);
    else if (in_run)
        this._spawn_parent_guess(in_run);
    if (opt.init)
        opt.init.call(this);
    if (opt.async)
    {
        var wait_retval = this._set_wait_retval();
        E.nextTick(function(){
            if (_this.running!==undefined)
                return;
            _this._got_retval(wait_retval);
        });
    }
    else
        this._next_run();
    return this;
}
zutil.inherits(Etask, events.EventEmitter);

E.prototype._root_remove = function(){
    assert(!this.parent, 'cannot remove from root when has parent');
    if (!array.rm_elm_tail(E.root, this))
        assert(0, 'etask not in root\n'+E.ps({MARK: this}));
};

E.prototype._parent_remove = function(){
    if (this.up)
    {
        var up = this.up;
        this.up = this.up.down = undefined;
        if (up.tm_completed)
            up._check_free();
        return;
    }
    if (this.parent_guess)
        this._parent_guess_remove();
    if (!this.parent)
        return this._root_remove();
    if (!array.rm_elm_tail(this.parent.child, this))
    {
        assert(0, 'etask child not in parent\n'
            +E.ps({MARK: [['child', this], ['parent', this.parent]]}));
    }
    if (this.parent.tm_completed)
        this.parent._check_free();
    this.parent = undefined;
};

E.prototype._check_free = function(){
    if (this.down || this.child.length)
        return;
    this._parent_remove();
    this.free = true;
};

E.prototype._call_err = function(e){
    E.ef(e);
    // XXX derry: add assert(0, 'etask err in signal: '+e);
};
E.prototype.emit_safe = function(){
    try { this.emit.apply(this, arguments); }
    catch(e){ this._call_err(e); }
};
E.prototype._call_safe = function(state_fn){
    try { return state_fn.call(this); }
    catch(e){ this._call_err(e); }
};
E.prototype._complete = function(){
    if (zerr.is(zerr.L.DEBUG))
        zerr.debug(this._name+': close');
    this.tm_completed = Date.now();
    this.parent_type = this.up ? 'call' : 'spawn';
    if (this.error)
        this.emit_safe('uncaught', this.error);
    if (this._finally!==undefined)
    {
        var ret = this._call_safe(this.states[this._finally].f);
        if (E.is_err(ret))
            this._set_retval(ret);
    }
    this.emit_safe('finally');
    this.emit_safe('ensure');
    if (this.error && !this.up && !this.parent && !this.parent_guess)
        E.events.emit('uncaught', this);
    if (this.parent)
        this.parent.emit('child', this);
    if (this.up && (this.down || this.child.length))
    {
        var up = this.up;
        this.up = this.up.down = undefined;
        this.parent = up;
        up.child.push(this);
    }
    this._check_free();
    this._del_wait_timer();
    this.del_alarm();
    this._ecancel_child();
    this.emit_safe('finally1');
    while (this.then_waiting.length)
        this.then_waiting.pop()();
};
E.prototype._next = function(rv){
    if (this.tm_completed)
        return true;
    rv = rv||{ret: undefined, err: undefined};
    var states = this.states;
    var state = this.at_return ? states.length :
        this.next_state!==undefined ? this.next_state :
        this.cur_state+1;
    this.retval = rv.ret;
    this.error = rv.err;
    if (rv.err!==undefined)
    {
        if (zerr.on_exception)
            zerr.on_exception(rv.err);
        if (this.run_state.try_catch)
        {
            this.use_retval = true;
            for (; state<states.length && states[state].sig; state++);
        }
        else
            for (; state<states.length && !states[state].catch; state++);
    }
    else
    {
        for (; state<states.length &&
            (states[state].sig || states[state].catch); state++);
    }
    this.cur_state = state;
    this.run_state = states[state];
    this.next_state = undefined;
    if (this.cur_state<states.length)
        return false;
    this._complete();
    return true;
};

E.prototype._next_run = function(rv){
    if (this._next(rv))
        return;
    this._run();
};
E.prototype._handle_rv = function(rv){
    var wait_retval, _this = this, ret = rv.ret;
    if (ret===this.retval); // fast-path: retval already set
    else if (!ret);
    else if (ret instanceof Etask)
    {
        if (!ret.tm_completed)
        {
            this._set_down(ret);
            wait_retval = this._set_wait_retval();
            ret.then_waiting.push(function(){
                _this._got_retval(wait_retval, E.err_res(ret.error,
                    ret.retval));
            });
            return true;
        }
        rv.err = ret.error;
        rv.ret = ret.retval;
    }
    else if (ret instanceof Etask_err)
    {
        rv.err = ret.error;
        rv.ret = undefined;
    }
    else if (typeof ret.then=='function') // promise
    {
        wait_retval = this._set_wait_retval();
        ret.then(function(ret){ _this._got_retval(wait_retval, ret); },
            function(err){ _this._got_retval(wait_retval, E.err(err)); });
        return true;
    }
    // generator
    else if (typeof ret.next=='function' && typeof ret.throw=='function')
    {
        rv.ret = E._generator(ret, this.states[this.cur_state]);
        return this._handle_rv(rv);
    }
    return false;
};
E.prototype._set_retval = function(ret){
    if (ret===this.retval && !this.error); // fast-path retval already set
    else if (!ret)
    {
        this.retval = ret;
        this.error = undefined;
    }
    else if (ret instanceof Etask)
    {
        if (ret.tm_completed)
        {
            this.retval = ret.retval;
            this.error = ret.error;
        }
    }
    else if (ret instanceof Etask_err)
    {
        this.retval = undefined;
        this.error = ret.error;
    }
    else if (typeof ret.then=='function'); // promise
    // generator
    else if (typeof ret.next=='function' && typeof ret.throw=='function');
    else
    {
        this.retval = ret;
        this.error = undefined;
    }
    return ret;
};

E.prototype._set_wait_retval = function(){
    return this.wait_retval = new Etask_wait(this, 'wait_int'); };
E.in_run = [];
E.in_run_top = function(){ return E.in_run[E.in_run.length-1]; };
E.prototype._run = function(){
    var rv = {ret: undefined, err: undefined};
    while (1)
    {
        var cb_ctx;
        var arg = this.error && !this.use_retval ? this.error : this.retval;
        this.use_retval = false;
        this.running = true;
        rv.ret = rv.err = undefined;
        E.in_run.push(this);
        if (zerr.is(zerr.L.DEBUG))
            zerr.debug(this._name+':S'+this.cur_state+': running');
        if (cb_pre)
            cb_ctx = cb_pre(this);
        try { rv.ret = this.run_state.f.call(this, arg); }
        catch(e){
            rv.err = e;
            if (rv.err instanceof Error)
                rv.err.etask = this;
        }
        if (cb_post)
            cb_post(this, cb_ctx);
        this.running = false;
        E.in_run.pop();
        for (; this.child_guess.length;
            this.child_guess.pop().parent_guess = undefined);
        if (rv.ret instanceof Etask_wait)
        {
            var wait_completed = false, wait = rv.ret;
            if (!this.at_continue && !wait.ready)
            {
                this.wait_retval = wait;
                if (wait.op=='wait_child')
                     wait_completed = this._set_wait_child(wait);
                if (wait.timeout)
                    this._set_wait_timer(wait.timeout);
                if (!wait_completed)
                    return;
                this.wait_retval = undefined;
            }
            rv.ret = this.at_continue ? this.at_continue.ret :
                wait.ready && !wait.completed ? wait.ready.ret : undefined;
            wait.completed = true;
        }
        this.at_continue = undefined;
        if (this._handle_rv(rv))
            return;
        if (this._next(rv))
            return;
    }
};

E.prototype._set_down = function(down){
    if (this.down)
        assert(0, 'caller already has a down\n'+this.ps());
    if (down.parent_guess)
        down._parent_guess_remove();
    assert(!down.parent, 'returned etask already has a spawn parent');
    assert(!down.up, 'returned etask already has a caller parent');
    down._parent_remove();
    this.down = down;
    down.up = this;
};

var func_type_cache = {};
E.prototype._get_func_type = function(func, on_fail){
    var name = func.name;
    var type = func_type_cache[name];
    if (type)
        return type;
    type = func_type_cache[name] = {name: undefined, label: undefined,
        try_catch: undefined, catch: undefined, finally: undefined,
        cancel: undefined};
    if (!name)
        return type;
    type.name = name;
    var n = name.split('$');
    if (n.length==1)
    {
        type.label = n[0];
        return type;
    }
    if (n.length>2)
        return type;
    if (n[1].length)
        type.label = n[1];
    var f = n[0].split('_');
    for (var j=0; j<f.length; j++)
    {
        if (f[j]=='try')
        {
            type.try_catch = true;
            if (f[j+1]=='catch')
                j++;
        }
        else if (f[j]=='catch')
            type['catch'] = true;
        else if (f[j]=='finally' || f[j]=='ensure')
            type.finally = true;
        else if (f[j]=='cancel')
            type.cancel = true;
        else
        {
            return void (on_fail||assert.bind(null, false))(
                'unknown func name '+name);
        }
    }
    return type;
};

E.prototype.spawn = function(child, replace){
    if (!(child instanceof Etask) && child && typeof child.then=='function')
    {
        var promise = child;
        child = etask([function(){ return promise; }]);
    }
    if (!(child instanceof Etask)) // promise already completed?
    {
        this.emit('child', child);
        return;
    }
    if (!replace && child.parent)
        assert(0, 'child already has a parent\n'+child.parent.ps());
    child.spawn_parent(this);
};

E.prototype._spawn_parent_guess = function(parent){
    this.parent_guess = parent;
    parent.child_guess.push(this);
};
E.prototype._parent_guess_remove = function(){
    if (!array.rm_elm_tail(this.parent_guess.child_guess, this))
        assert(0, 'etask not in parent_guess\n'+E.ps({MARK: this}));
    this.parent_guess = undefined;
};
E.prototype.spawn_parent = function(parent){
    if (this.up)
        assert(0, 'child already has an up\n'+this.up.ps());
    if (this.tm_completed && !this.parent)
        return;
    this._parent_remove();
    if (parent && parent.free)
        parent = undefined;
    if (!parent)
        return void E.root.push(this);
    parent.child.push(this);
    this.parent = parent;
};

E.prototype.set_state = function(name){
    var state = this.states.idx[name];
    assert(state!==undefined, 'named func "'+name+'" not found');
    return this.next_state = state;
};

E.prototype.finally = function(cb){
    this.prependListener('finally', cb);
};
E.prototype.goto_fn = function(name){
    return this.goto.bind(this, name); };
E.prototype.goto = function(name, promise){
    this.set_state(name);
    var state = this.states[this.next_state];
    assert(!state.sig, 'goto to sig');
    return this.continue(promise);
};

E.prototype.loop = function(promise){
    this.next_state = this.cur_state;
    return promise;
};

E.prototype._set_wait_timer = function(timeout){
    var _this = this;
    this.wait_timer = setTimeout(function(){
        _this.wait_timer = undefined;
        _this._next_run({ret: undefined, err: 'timeout'});
    }, timeout);
};
E.prototype._del_wait_timer = function(){
    if (this.wait_timer)
        this.wait_timer = clearTimeout(this.wait_timer);
    this.wait_retval = undefined;
};
E.prototype._get_child_running = function(from){
    var i, child = this.child;
    for (i=from||0; i<child.length && child[i].tm_completed; i++);
    return i>=child.length ? -1 : i;
};
E.prototype._set_wait_child = function(wait_retval){
    var i, _this = this, child = wait_retval.child;
    var cond = wait_retval.cond, wait_on;
    assert(!cond || child=='any', 'condition supported only for "any" '+
        'option, you can add support if needed');
    if (child=='any')
    {
        if (this._get_child_running()<0)
            return true;
        wait_on = function(){
            _this.once('child', function(child){
                if (!cond || cond.call(child, child.retval))
                    return _this._got_retval(wait_retval, {child: child});
                if (_this._get_child_running()<0)
                    return _this._got_retval(wait_retval);
                wait_on();
            });
        };
        wait_on();
    }
    else if (child=='all')
    {
        if ((i = this._get_child_running())<0)
            return true;
        wait_on = function(child){
            _this.once('child', function(child){
                var i;
                if ((i = _this._get_child_running())<0)
                    return _this._got_retval(wait_retval);
                wait_on(_this.child[i]);
            });
        };
        wait_on(this.child[i]);
    }
    else
    {
        assert(child, 'no child provided');
        assert(this===child.parent, 'child does not belong to parent');
        if (child.tm_completed)
            return true;
        child.once('finally', function(){
            return _this._got_retval(wait_retval, {child: child}); });
    }
    this.emit_safe('wait_on_child');
};

E.prototype._got_retval = function(wait_retval, res){
    if (this.wait_retval!==wait_retval || wait_retval.completed)
        return;
    wait_retval.completed = true;
    this._next_run(E._res2rv(res));
};
E.prototype.continue_fn = function(){
    return this.continue.bind(this); };
E.continue_depth = 0;
E.prototype.continue = function(promise, sync){
    this.wait_retval = undefined;
    this._set_retval(promise);
    if (this.tm_completed)
        return promise;
    if (this.down)
        this.down._ecancel();
    this._del_wait_timer();
    var rv = {ret: promise, err: undefined};
    if (this.running)
    {
        this.at_continue = rv;
        return promise;
    }
    if (this._handle_rv(rv))
        return rv.ret;
    var _this = this;
    if (E.is_final(promise) &&
        (!E.continue_depth && !E.in_run.length || sync))
    {
        E.continue_depth++;
        this._next_run(rv);
        E.continue_depth--;
    }
    else // avoid high stack depth
        E.nextTick(function(){ _this._next_run(rv); });
    return promise;
};

E.prototype._ecancel = function(){
    if (this.tm_completed)
        return this;
    this.emit_safe('cancel');
    if (this.cancel!==undefined)
        return this._call_safe(this.states[this.cancel].f);
    if (this.cancelable)
        return this.return();
};

E.prototype._ecancel_child = function(){
    if (!this.child.length)
        return;
    // copy array, since ecancel has side affects and can modify array
    var child = Array.from(this.child);
    for (var i=0; i<child.length; i++)
        child[i]._ecancel();
};

E.prototype.return_fn = function(){
    return this.return.bind(this); };
E.prototype.return = function(promise){
    if (this.tm_completed)
        return this._set_retval(promise);
    this.at_return = true;
    this.next_state = undefined;
    return this.continue(promise, true);
};

E.prototype.del_alarm = function(){
    var a = this._alarm;
    if (!a)
        return;
    clearTimeout(a.id);
    if (a.cb)
        this.removeListener('sig_alarm', a.cb);
    this._alarm = undefined;
};

E.prototype.alarm_left = function(){
    var a = this._alarm;
    if (!a)
        return 0;
    return a.start-Date.now();
};

E.prototype._operation_opt = function(opt){
    if (opt.goto)
        return {ret: this.goto(opt.goto, opt.ret)};
    if (opt.throw)
        return {ret: this.throw(opt.throw)};
    if (opt.return!==undefined)
        return {ret: this.return(opt.return)};
    if (opt.continue!==undefined)
        return {ret: this.continue(opt.continue)};
};

E.prototype.alarm = function(ms, cb){
    var _this = this, opt, a;
    if (cb && typeof cb!='function')
    {
        opt = cb;
        cb = function(){
            var v;
            if (!(v = _this._operation_opt(opt)))
                assert(0, 'invalid alarm cb opt');
            return v.ret;
        };
    }
    this.del_alarm();
    a = this._alarm = {ms: ms, cb: cb, start: Date.now()};
    a.id = setTimeout(function(){
        _this._alarm = undefined;
        _this.emit('sig_alarm');
    }, a.ms);
    if (cb)
        this.once('sig_alarm', cb);
};

function Etask_wait(et, op, timeout){
    this.timeout = timeout;
    this.et = et;
    this.op = op;
    this.child = this.at_child = this.cond = undefined;
    this.ready = this.completed = undefined;
}
Etask_wait.prototype.continue = function(res){
    if (this.completed)
        return;
    if (!this.et.wait_retval)
        return void(this.ready = {ret: res});
    if (this!==this.et.wait_retval)
        return;
    this.et.continue(res);
};
Etask_wait.prototype.continue_fn = function(){
    return this.continue.bind(this); };
Etask_wait.prototype.throw = function(err){
    return this.continue(E.err(err)); };
Etask_wait.prototype.throw_fn = function(){
    return this.throw.bind(this); };
E.prototype.wait = function(timeout){
    return new Etask_wait(this, 'wait', timeout); };
E.prototype.wait_child = function(child, timeout, cond){
    if (typeof timeout=='function')
    {
        cond = timeout;
        timeout = 0;
    }
    var wait = new Etask_wait(this, 'wait_child', timeout);
    wait.child = child;
    wait.at_child = null;
    wait.cond = cond;
    return wait;
};

E.prototype.throw_fn = function(err){
    return err ? this.throw.bind(this, err) : this.throw.bind(this); };
E.prototype.throw = function(err){
    return this.continue(E.err(err)); };

E.prototype.get_name = function(flags){
    /* anon: Context.<anonymous> (/home/yoni/zon1/pkg/util/test.js:1740:7)
     * with name: Etask.etask1_1 (/home/yoni/zon1/pkg/util/test.js:1741:11) */
    var stack = this._stack instanceof Error ? this._stack.stack.split('\n') :
        undefined;
    var caller;
    flags = flags||{};
    if (stack)
    {
        caller = /^    at (.*)$/.exec(stack[4]);
        caller = caller ? caller[1] : undefined;
    }
    var names = [];
    if (this.name)
        names.push(this.name);
    if (caller && !(this.name && flags.SHORT_NAME))
        names.push(caller);
    if (!names.length)
        names.push('noname');
    return names.join(' ');
};

E.prototype.state_str = function(){
    return this.cur_state+(this.next_state ? '->'+this.next_state : ''); };

E.prototype.get_depth = function(){
    var i=0, et = this;
    for (; et; et = et.up, i++);
    return i;
};

function trim_space(s){
    if (s[s.length-1]!=' ')
        return s;
    return s.slice(0, -1);
}
function ms_to_str(ms){ // from date.js
    var s = ''+ms;
    return s.length<=3 ? s+'ms' : s.slice(0, -3)+'.'+s.slice(-3)+'s';
}
E.prototype.get_time_passed = function(){
    return ms_to_str(Date.now()-this.tm_create); };
E.prototype.get_time_completed = function(){
    return ms_to_str(Date.now()-this.tm_completed); };
E.prototype.get_info = function(){
    var info = this.info, s = '', _i;
    if (!info)
        return '';
    for (var i in info)
    {
        _i = info[i];
        if (!_i)
            continue;
        if (s!=='')
            s += ' ';
        if (typeof _i=='function')
            s += _i();
        else
            s += _i;
    }
    return trim_space(s);
};

// light-weight efficient etask/promise error value
function Etask_err(err){ this.error = err || new Error(); }
E.Etask_err = Etask_err;
E.err = function(err){ return new Etask_err(err); };
E.is_err = function(v){
    return (v instanceof Etask && v.error!==undefined) ||
        v instanceof Etask_err;
};
E.err_res = function(err, res){ return err ? E.err(err) : res; };
E._res2rv = function(res){
    return E.is_err(res) ? {ret: undefined, err: res.error}
        : {ret: res, err: undefined};
};
E.is_final = function(v){
    return !v || typeof v.then!='function' || v instanceof Etask_err ||
        (v instanceof Etask && !!v.tm_completed);
};

// promise compliant .then() implementation for Etask and Etask_err.
// for unit-test comfort, also .otherwise(), .catch(), .ensure(), resolve() and
// reject() are implemented.
E.prototype.then = function(on_res, on_err){
    var _this = this;
    function on_done(){
        if (!_this.error)
            return !on_res ? _this.retval : on_res(_this.retval);
        return !on_err ? E.err(_this.error) : on_err(_this.error);
    }
    if (this.tm_completed)
        return etask('then_completed', [function(){ return on_done(); }]);
    var then_wait = etask('then_wait', [function(){ return this.wait(); }]);
    this.then_waiting.push(function(){
        try { then_wait.continue(on_done()); }
        catch(e){ then_wait.throw(e); }
    });
    return then_wait;
};
E.prototype.otherwise = E.prototype.catch = function(on_err){
    return this.then(null, on_err); };
E.prototype.ensure = function(on_ensure){
    return this.then(function(res){ on_ensure(); return res; },
        function(err){ on_ensure(); throw err; });
};
Etask_err.prototype.then = function(on_res, on_err){
    var _this = this;
    return etask('then_err', [function(){
        return !on_err ? E.err(_this.error) : on_err(_this.error);
    }]);
};
Etask_err.prototype.otherwise = Etask_err.prototype.catch = function(on_err){
    return this.then(null, on_err); };
Etask_err.prototype.ensure = function(on_ensure){
    this.then(null, function(){ on_ensure(); });
    return this;
};
E.resolve = function(res){ return etask([function(){ return res; }]); };
E.reject = function(err){ return etask([function(){ throw err; }]); };

E.prototype.wait_ext = function(promise){
    if (!promise || typeof promise.then!='function')
        return promise;
    var wait = this.wait();
    promise.then(wait.continue_fn(), wait.throw_fn());
    return wait;
};

E.prototype.longname = function(flags){
    flags = flags||{TIME: 1};
    var s = '', _s;
    if (this.running)
        s += 'RUNNING ';
    s += this.get_name(flags)+(!this.tm_completed ? '.'+this.state_str() : '')
        +' ';
    if (this.tm_completed)
        s += 'COMPLETED'+(flags.TIME ? ' '+this.get_time_completed() : '')+' ';
    if (flags.TIME)
        s += this.get_time_passed()+' ';
    if (_s = this.get_info())
        s += _s+' ';
    return trim_space(s);
};
E.prototype.stack = function(flags){
    var et = this, s = '';
    flags = assign({STACK: 1, RECURSIVE: 1, GUESS: 1}, flags);
    while (et)
    {
        var _s = et.longname(flags)+'\n';
        if (et.up)
            et = et.up;
        else if (et.parent)
        {
            _s = (et.parent_type=='call' ? 'CALL' : 'SPAWN')+' '+_s;
            et = et.parent;
        }
        else if (et.parent_guess && flags.GUESS)
        {
            _s = 'SPAWN? '+_s;
            et = et.parent_guess;
        }
        else
            et = undefined;
        if (flags.TOPDOWN)
            s = _s+s;
        else
            s += _s;
    }
    return s;
};
E.prototype._ps = function(pre_first, pre_next, flags){
    var i, s = '', task_trail, et = this, child_guess;
    if (++flags.limit_n>=flags.LIMIT)
        return flags.limit_n==flags.LIMIT ? '\nLIMIT '+flags.LIMIT+'\n': '';
    /* get top-most et */
    for (; et.up; et = et.up);
    /* print the sp frames */
    for (var first = 1; et; et = et.down, first = 0)
    {
        s += first ? pre_first : pre_next;
        first = 0;
        if (flags.MARK && (i = flags.MARK.sp.indexOf(et))>=0)
            s += (flags.MARK.name[i]||'***')+' ';
        s += et.longname(flags)+'\n';
        if (flags.RECURSIVE)
        {
            var stack_trail = et.down ? '.' : ' ';
            var child = et.child;
            if (flags.GUESS)
                child = child.concat(et.child_guess);
            for (i = 0; i<child.length; i++)
            {
                task_trail = i<child.length-1 ? '|' : stack_trail;
                child_guess = child[i].parent_guess ? '\\? ' :
                    child[i].parent_type=='call' ? '\\> ' : '\\_ ';
                s += child[i]._ps(pre_next+task_trail+child_guess,
                    pre_next+task_trail+'   ', flags);
            }
        }
    }
    return s;
};
function ps_flags(flags){
    var m, _m;
    if (m = flags.MARK)
    {
        if (!Array.isArray(m))
            _m = {sp: [m], name: []};
        else if (!Array.isArray(flags.MARK[0]))
            _m = {sp: m, name: []};
        else
        {
            _m = {sp: [], name: []};
            for (var i=0; i<m.length; i++)
            {
                _m.name.push(m[i][0]);
                _m.sp.push(m[i][1]);
            }
        }
        flags.MARK = _m;
    }
}
E.prototype.ps = function(flags){
    flags = assign({STACK: 1, RECURSIVE: 1, LIMIT: 10000000, TIME: 1,
        GUESS: 1}, flags, {limit_n: 0});
    ps_flags(flags);
    return this._ps('', '', flags);
};
E._longname_root = function(){
    return (zerr.prefix ? zerr.prefix+'pid '+process.pid+' ' : '')+'root'; };
E.ps = function(flags){
    var i, s = '', task_trail;
    flags = assign({STACK: 1, RECURSIVE: 1, LIMIT: 10000000, TIME: 1,
        GUESS: 1}, flags, {limit_n: 0});
    ps_flags(flags);
    s += E._longname_root()+'\n';
    var child = E.root;
    if (flags.GUESS)
    {
        child = [];
        for (i=0; i<E.root.length; i++)
        {
            if (!E.root[i].parent_guess)
                child.push(E.root[i]);
        }
    }
    for (i=0; i<child.length; i++)
    {
        task_trail = i<child.length-1 ? '|' : ' ';
        s += child[i]._ps(task_trail+'\\_ ', task_trail+'   ', flags);
    }
    return s;
};

function assert_tree_unique(a){
    var i;
    for (i=0; i<a.length-1; i++)
        assert(!a.includes(a[i], i+1));
}
E.prototype._assert_tree = function(opt){
    var i, et;
    opt = opt||{};
    assert_tree_unique(this.child);
    assert(this.parent);
    if (this.down)
    {
        et = this.down;
        assert(et.up===this);
        assert(!et.parent);
        assert(!et.parent_guess);
        this.down._assert_tree(opt);
    }
    for (i=0; i<this.child.length; i++)
    {
        et = this.child[i];
        assert(et.parent===this);
        assert(!et.parent_guess);
        assert(!et.up);
        et._assert_tree(opt);
    }
    if (this.child_guess.length)
        assert(E.in_run.includes(this));
    for (i=0; i<this.child_guess.length; i++)
    {
        et = this.child_guess[i];
        assert(et.parent_guess===this);
        assert(!et.parent);
        assert(!et.up);
    }
};
E._assert_tree = function(opt){
    var i, et, child = E.root;
    opt = opt||{};
    assert_tree_unique(E.root);
    for (i=0; i<child.length; i++)
    {
        et = child[i];
        assert(!et.parent);
        assert(!et.up);
        et._assert_tree(opt);
    }
};
E.prototype._assert_parent = function(){
    if (this.up)
        return assert(!this.parent && !this.parent_guess);
    assert(this.parent && this.parent_guess,
        'parent_guess together with parent');
    if (this.parent)
    {
        var child = this.parent ? this.parent.child : E.root;
        assert(child.includes(this),
            'cannot find in parent '+(this.parent ? '' : 'root'));
    }
    else if (this.parent_guess)
    {
        assert(this.parent_guess.child_guess.includes(this),
            'cannot find in parent_guess');
        assert(E.in_run.includes(this.parent_guess));
    }
};

E.prototype.return_child = function(){
    // copy array, since return() has side affects and can modify array
    var child = Array.from(this.child);
    for (var i=0; i<child.length; i++)
        child[i].return();
};

E.sleep = function(ms){
    var timer;
    ms = ms||0;
    return etask({name: 'sleep', cancel: true}, [function(){
        this.info.ms = ms+'ms';
        timer = setTimeout(this.continue_fn(), ms);
        return this.wait();
    }, function finally$(){
        clearTimeout(timer);
    }]);
};

var ebreak_obj = {ebreak: 1};
E.prototype.break = function(ret){
    return this.throw({ebreak: ebreak_obj, ret: ret}); };
E.for = function(cond, inc, opt, states){
    if (Array.isArray(opt) || typeof opt=='function')
    {
        states = opt;
        opt = {};
    }
    if (typeof states=='function')
        states = [states];
    opt = opt||{};
    return etask({name: 'for', cancel: true, init: opt.init_parent},
    [function loop(){
        return !cond || cond.call(this);
    }, function try_catch$(res){
        if (!res)
            return this.return();
        return etask({name: 'for_iter', cancel: true, init: opt.init},
            states||[]);
    }, function(){
        if (this.error)
        {
            if (this.error.ebreak===ebreak_obj)
                return this.return(this.error.ret);
            return this.throw(this.error);
        }
        return inc && inc.call(this);
    }, function(){
        return this.goto('loop');
    }]);
};
E.for_each = function(obj, states){
    var keys = Object.keys(obj);
    var iter = {obj: obj, keys: keys, i: 0, key: undefined, val: undefined};
    function init_iter(){ this.iter = iter; }
    return E.for(function(){
            this.iter = this.iter||iter;
            iter.key = keys[iter.i];
            iter.val = obj[keys[iter.i]];
            return iter.i<keys.length;
        },
        function(){ return iter.i++; },
        {init: init_iter, init_parent: init_iter},
        states);
};
E.while = function(cond, states){ return E.for(cond, null, states); };

// all([opt, ]a_or_o)
E.all = function(a_or_o, ao2){
    var i, j, opt = {};
    if (ao2)
    {
        opt = a_or_o;
        a_or_o = ao2;
    }
    if (Array.isArray(a_or_o))
    {
        var a = Array.from(a_or_o);
        i = 0;
        return etask({name: 'all_a', cancel: true}, [function(){
            for (j=0; j<a.length; j++)
                this.spawn(a[j]);
        }, function try_catch$loop(){
            if (i>=a.length)
                return this.return(a);
            this.info.at = 'at '+i+'/'+a.length;
            var _a = a[i];
            if (_a instanceof Etask)
                _a.spawn_parent();
            return _a;
        }, function(res){
            if (this.error)
            {
                if (!opt.allow_fail)
                    return this.throw(this.error);
                res = E.err(this.error);
            }
            a[i] = res;
            i++;
            return this.goto('loop');
        }]);
    }
    else if (a_or_o instanceof Object)
    {
        var keys = Object.keys(a_or_o), o = {};
        i = 0;
        return etask({name: 'all_o', cancel: true}, [function(){
            for (j=0; j<keys.length; j++)
                this.spawn(a_or_o[keys[j]]);
        }, function try_catch$loop(){
            if (i>=keys.length)
                return this.return(o);
            var _i = keys[i], _a = a_or_o[_i];
            this.info.at = 'at '+_i+' '+i+'/'+keys.length;
            if (_a instanceof Etask)
                _a.spawn_parent();
            return _a;
        }, function(res){
            if (this.error)
            {
                if (!opt.allow_fail)
                    return this.throw(this.error);
                res = E.err(this.error);
            }
            o[keys[i]] = res;
            i++;
            return this.goto('loop');
        }]);
    }
    else
        assert(0, 'invalid type');
};

E.all_limit = function(limit, arr_iter, cb){
    var at = 0;
    var iter = !Array.isArray(arr_iter) ? arr_iter : function(){
        if (at<arr_iter.length)
            return cb.call(this, arr_iter[at++]);
    };
    return etask({name: 'all_limit', cancel: true}, [function(){
        var next;
        if (!(next = iter.call(this)))
            return this.goto('done');
        this.spawn(next);
        this.loop();
        if (this.child.length>=limit)
            return this.wait_child('any');
    }, function done(){
        return this.wait_child('all');
    }]);
};

// _apply(opt, func[, _this], args)
// _apply(opt, object, method, args)
E._apply = function(opt, func, _this, args){
    var func_name;
    if (typeof _this=='string') // class with '.method' string call
    {
        assert(_this[0]=='.', 'invalid method '+_this);
        var method = _this.slice(1), _class = func;
        func = _class[method];
        _this = _class;
        assert(_this instanceof Object, 'invalid method .'+method);
        func_name = method;
    }
    else if (Array.isArray(_this) && !args)
    {
        args = _this;
        _this = null;
    }
    opt.name = opt.name||func_name||func.name;
    return etask(opt, [function(){
        var et = this, ret_sync, returned = 0;
        args = Array.from(args);
        args.push(function cb(err, res){
            if (typeof opt.ret_sync=='string' && !returned)
            {
                // hack to wait for result
                var a = arguments;
                returned++;
                return void E.nextTick(function(){ cb.apply(null, a); });
            }
            var nfn = opt.nfn===undefined || opt.nfn ? 1 : 0;
            if (opt.ret_o)
            {
                var o = {}, i;
                if (Array.isArray(opt.ret_o))
                {
                    for (i=0; i<opt.ret_o.length; i++)
                        o[opt.ret_o[i]] = arguments[i+nfn];
                }
                else if (typeof opt.ret_o=='string')
                    o[opt.ret_o] = array.slice(arguments, nfn);
                else
                    assert(0, 'invalid opt.ret_o');
                if (typeof opt.ret_sync=='string')
                    o[opt.ret_sync] = ret_sync;
                res = o;
            }
            else if (opt.ret_a)
                res = array.slice(arguments, nfn);
            else if (!nfn)
                res = err;
            et.continue(nfn ? E.err_res(err, res) : res);
        });
        ret_sync = func.apply(_this, args);
        if (Array.isArray(opt.ret_sync))
            opt.ret_sync[0][opt.ret_sync[1]] = ret_sync;
        returned++;
        return this.wait();
    }]);
};

// nfn_apply([opt, ]object, method, args)
// nfn_apply([opt, ]func, this, args)
E.nfn_apply = function(opt, func, _this, args){
    var _opt = {nfn: 1};
    if (typeof opt=='function' || typeof func=='string')
    {
        args = _this;
        _this = func;
        func = opt;
        opt = _opt;
    }
    else
        opt = assign(_opt, opt);
    return E._apply(opt, func, _this, args);
};
// cb_apply([opt, ]object, method, args)
// cb_apply([opt, ]func, this, args)
E.cb_apply = function(opt, func, _this, args){
    var _opt = {nfn: 0};
    if (typeof opt=='function' || typeof func=='string')
    {
        args = _this;
        _this = func;
        func = opt;
        opt = _opt;
    }
    else
        opt = assign(_opt, opt);
    return E._apply(opt, func, _this, args);
};

E.prototype.continue_nfn = function(){
    return function(err, res){ this.continue(E.err_res(err, res)); }
    .bind(this);
};

E.augment = function(_prototype, method, e_method){
    var i, opt = {};
    if (method instanceof Object && !Array.isArray(method))
    {
        assign(opt, method);
        method = arguments[2];
        e_method = arguments[3];
    }
    if (Array.isArray(method))
    {
        if (e_method)
            opt.prefix = e_method;
        for (i=0; i<method.length; i++)
            E.augment(_prototype, opt, method[i]);
        return;
    }
    opt.prefix = opt.prefix||'e_';
    if (!e_method)
        e_method = opt.prefix+method;
    var fn = _prototype[method];
    _prototype[e_method] = function(){
        return etask._apply({name: e_method, nfn: 1}, fn, this, arguments); };
};

E.wait = function(timeout){
    return etask({name: 'wait', cancel: true},
        [function(){ return this.wait(timeout); }]);
};
E.to_nfn = function(promise, cb, opt){
    return etask({name: 'to_nfn', async: true}, [function try_catch$(){
        return promise;
    }, function(res){
        var ret = [this.error];
        if (opt && opt.ret_a)
            ret = ret.concat(res);
        else
            ret.push(res);
        cb.apply(null, ret);
    }]);
};
function etask_fn(opt, states, push_this){
    if (Array.isArray(opt) || typeof opt=='function')
    {
        states = opt;
        opt = undefined;
    }
    return function(){
        var _opt = assign({}, opt);
        _opt.state0_args = Array.from(arguments);
        if (push_this)
            _opt.state0_args.unshift(this);
        return etask(_opt, states);
    };
}
E.fn = function(opt, states){ return etask_fn(opt, states, false); };
E._fn = function(opt, states){ return etask_fn(opt, states, true); };
E._generator = function(gen, ctor, opt){
    opt = opt||{};
    opt.name = opt.name||(ctor && ctor.name)||'generator';
    if (opt.cancel===undefined)
        opt.cancel = true;
    var done;
    return etask(opt, [function(){
        this.generator = gen = gen||ctor.apply(this, opt.state0_args||[]);
        this.generator_ctor = ctor;
        return {ret: undefined, err: undefined};
    }, function try_catch$loop(rv){
        var res;
        try { res = rv.err ? gen.throw(rv.err) : gen.next(rv.ret); }
        catch(e){ return this.return(E.err(e)); }
        if (res.done)
        {
            done = true;
            return this.return(res.value);
        }
        return res.value;
    }, function(ret){
        return this.goto('loop', this.error ?
            {ret: undefined, err: this.error} : {ret: ret, err: undefined});
    }, function finally$(){
        // https://kangax.github.io/compat-table/es6/#test-generators_%GeneratorPrototype%.return
        // .return() supported only in node>=6.x.x
        if (!done && gen.return)
            try { gen.return(); } catch(e){}
    }]);
};
E.ef = function(err){ // error filter
    if (zerr.on_exception)
        zerr.on_exception(err);
    return err;
};
// similar to setInterval
// opt==10000 (or opt.ms==10000) - call states every 10 seconds
// opt.mode=='smart' - default mode, like setInterval. If states take
//   longer than 'ms' to execute, next execution is delayed.
// opt.mode=='fixed' - always sleep 10 seconds between states
// opt.mode=='spawn' - spawn every 10 seconds
E.interval = function(opt, states){
    if (typeof opt=='number')
        opt = {ms: opt};
    if (opt.mode=='fixed')
    {
        return E.for(null, function(){ return etask.sleep(opt.ms); },
            states);
    }
    if (opt.mode=='smart' || !opt.mode)
    {
        var now;
        return E.for(function(){ now = Date.now(); return true; },
            function(){
                var delay = zutil.clamp(0, now+opt.ms-Date.now(), Infinity);
                return etask.sleep(delay);
            }, states);
    }
    if (opt.mode=='spawn')
    {
        var stopped = false;
        return etask([function loop(){
            etask([function try_catch$(){
                return etask(states);
            }, function(res){
                if (!this.error)
                    return;
                if (this.error.ebreak!==ebreak_obj)
                    return this.throw(this.error);
                stopped = true;
            }]);
        }, function(){
            if (stopped)
                return this.return();
            return etask.sleep(opt.ms);
        }, function(){
            if (stopped) // stopped during sleep by prev long iteration
                return this.return();
            return this.goto('loop');
        }]);
    }
    throw new Error('unexpected mode '+opt.mode);
};

return Etask; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 362:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint browser:true, react:true, es6:true*/

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

__webpack_require__(207);

__webpack_require__(208);

__webpack_require__(210);

__webpack_require__(211);

var _angular = __webpack_require__(85);

var _angular2 = _interopRequireDefault(_angular);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(137);

var _moment2 = _interopRequireDefault(_moment);

var _codemirror = __webpack_require__(138);

var _codemirror2 = _interopRequireDefault(_codemirror);

var _date = __webpack_require__(105);

var _date2 = _interopRequireDefault(_date);

var _csv = __webpack_require__(373);

var _csv2 = _interopRequireDefault(_csv);

var _url = __webpack_require__(374);

var _url2 = _interopRequireDefault(_url);

var _stats = __webpack_require__(375);

var _stats2 = _interopRequireDefault(_stats);

var _status_codes = __webpack_require__(98);

var _status_codes2 = _interopRequireDefault(_status_codes);

var _status_codes_detail = __webpack_require__(636);

var _status_codes_detail2 = _interopRequireDefault(_status_codes_detail);

var _domains = __webpack_require__(128);

var _domains2 = _interopRequireDefault(_domains);

var _domains_detail = __webpack_require__(637);

var _domains_detail2 = _interopRequireDefault(_domains_detail);

var _protocols = __webpack_require__(129);

var _protocols2 = _interopRequireDefault(_protocols);

var _intro = __webpack_require__(638);

var _intro2 = _interopRequireDefault(_intro);

var _add_proxy = __webpack_require__(686);

var _add_proxy2 = _interopRequireDefault(_add_proxy);

var _edit_proxy = __webpack_require__(687);

var _edit_proxy2 = _interopRequireDefault(_edit_proxy);

var _howto = __webpack_require__(327);

var _howto2 = _interopRequireDefault(_howto);

var _protocols_detail = __webpack_require__(688);

var _protocols_detail2 = _interopRequireDefault(_protocols_detail);

var _messages = __webpack_require__(689);

var _messages2 = _interopRequireDefault(_messages);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(25);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(21);

var _jquery2 = _interopRequireDefault(_jquery);

__webpack_require__(328);

__webpack_require__(329);

__webpack_require__(330);

__webpack_require__(331);

__webpack_require__(703);

__webpack_require__(332);

__webpack_require__(333);

__webpack_require__(334);

__webpack_require__(335);

__webpack_require__(336);

var _fileSaver = __webpack_require__(728);

var _fileSaver2 = _interopRequireDefault(_fileSaver);

var _common = __webpack_require__(64);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var url_o = _url2.default.parse(document.location.href);
var qs_o = _url2.default.qs_parse((url_o.search || '').substr(1));

window.feature_flag = function (flag) {
    var enable = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

    window.localStorage.setItem(flag, JSON.stringify(enable));
};

var is_electron = window.process && window.process.versions.electron;

var is_valid_field = function is_valid_field(proxy, name, zone_definition) {
    var value = proxy.zone || zone_definition.def;
    if (name == 'password') return value != 'gen';
    if ({ city: 1, state: 1 }[name] && (!proxy.country || proxy.country == '*')) return false;
    var details = zone_definition.values.filter(function (z) {
        return z.value == value;
    })[0];
    var permissions = details && details.perm.split(' ') || [];
    if (name == 'vip') {
        var plan = details && details.plans[details.plans.length - 1] || {};
        return !!plan.vip;
    }
    if (['country', 'state', 'city', 'asn', 'ip'].includes(name)) return permissions.includes(name);
    return true;
};

var _module = _angular2.default.module('app', ['ngSanitize', 'ui.bootstrap', 'ui.select', 'angular-google-analytics', 'ui.router']);

var analytics_provider = void 0;
var ga_event = _util2.default.ga_event;

_module.config(['$uibTooltipProvider', '$uiRouterProvider', '$locationProvider', 'AnalyticsProvider', function ($uibTooltipProvider, $uiRouter, $location_provider, _analytics_provider) {
    $location_provider.html5Mode(true);
    $uibTooltipProvider.options({ placement: 'bottom' });
    _analytics_provider.delayScriptTag(true);
    analytics_provider = _analytics_provider;

    $uiRouter.urlService.rules.otherwise({ state: 'settings' });

    var state_registry = $uiRouter.stateRegistry;
    state_registry.register({
        name: 'app',
        redirectTo: 'settings',
        controller: 'root'
    });
    state_registry.register({
        name: 'settings',
        parent: 'app',
        url: '/',
        templateUrl: 'settings.html'
    });
    state_registry.register({
        name: 'proxies',
        parent: 'app',
        url: '/proxies',
        params: { 'add_proxy': false },
        templateUrl: 'proxies.html'
    });
    state_registry.register({
        name: 'zones',
        parent: 'app',
        url: '/zones/{zone:string}',
        templateUrl: 'zones.html',
        params: { zone: { squash: true, value: null } }
    });
    state_registry.register({
        name: 'tools',
        parent: 'app',
        url: '/tools',
        templateUrl: 'tools.html'
    });
    state_registry.register({
        name: 'faq',
        parent: 'app',
        url: '/faq',
        templateUrl: 'faq.html'
    });
    state_registry.register({
        name: 'status_codes',
        parent: 'app',
        url: '/status_codes',
        template: '<div react-view=react_component></div>',
        controller: function controller($scope) {
            $scope.react_component = _status_codes2.default;
        }
    });
    state_registry.register({
        name: 'status_codes_detail',
        parent: 'app',
        url: '/status_codes/{code:int}',
        template: '<div react-view=react_component state-props=code\n        class=container></div>',
        controller: function controller($scope) {
            $scope.react_component = _status_codes_detail2.default;
        }
    });
    state_registry.register({
        name: 'domains',
        parent: 'app',
        url: '/domains',
        template: '<div react-view=react_component></div>',
        controller: function controller($scope) {
            $scope.react_component = _domains2.default;
        }
    });
    state_registry.register({
        name: 'domains_detail',
        parent: 'app',
        url: '/domains/{domain:string}',
        template: '<div react-view=react_component state-props=domain\n        class=container></div>',
        controller: function controller($scope) {
            $scope.react_component = _domains_detail2.default;
        }
    });
    state_registry.register({
        name: 'protocols',
        parent: 'app',
        url: '/protocols',
        template: '<div react-view=react_component></div>',
        controller: function controller($scope) {
            $scope.react_component = _protocols2.default;
        }
    });
    state_registry.register({
        name: 'protocols_detail',
        parent: 'app',
        url: '/protocols/{protocol:string}',
        template: '<div react-view=react_component state-props=protocol\n        class=container></div>',
        controller: function controller($scope) {
            $scope.react_component = _protocols_detail2.default;
        }
    });
    state_registry.register({
        name: 'intro',
        parent: 'app',
        url: '/intro',
        template: '<div react-view=react_component></div>',
        controller: function controller($scope) {
            $scope.react_component = _intro2.default;
        }
    });
    state_registry.register({
        name: 'howto',
        parent: 'app',
        url: '/howto',
        template: '<div react-view=react_component></div>',
        controller: function controller($scope) {
            var howto_wrapper = function howto_wrapper(props) {
                return _react2.default.createElement(_howto2.default, { ga_category: 'how-to-use' });
            };
            $scope.react_component = howto_wrapper;
        }
    });
    state_registry.register({
        name: 'edit_proxy',
        parent: 'app',
        url: '/proxy/{port:string}',
        template: '<div react-view=react_component state-props=port\n        extra-props=proxy></div>',
        controller: function controller($scope, $rootScope) {
            $scope.react_component = _edit_proxy2.default;
            $scope.proxy = $rootScope.edit_proxy;
        }
    });
}]);

_module.run(function ($rootScope, $http, $window, $transitions, $q, Analytics, $timeout) {
    var logged_in_resolver = $q.defer();
    $rootScope.logged_in = logged_in_resolver.promise;
    $transitions.onBefore({ to: function to(state) {
            $timeout(function () {
                $rootScope.hide_quickstart = !!(state.data || {}).hide_quickstart;
            });
            return !['app', 'faq'].includes(state.name);
        } }, function (transition) {
        return $q(function (resolve, reject) {
            $q.resolve($rootScope.logged_in).then(function (logged_in) {
                if (logged_in) {
                    if (!$window.localStorage.getItem('quickstart-intro') && $window.localStorage.getItem('quickstart') != 'dismissed') {
                        $window.localStorage.setItem('quickstart-intro', true);
                        return resolve(transition.router.stateService.target('intro'));
                    }
                    if (transition.to().name != 'settings') return resolve(true);
                    return resolve(transition.router.stateService.target('proxies', undefined, { location: true }));
                }
                if (transition.to().name == 'settings') return resolve(true);
                return resolve(transition.router.stateService.target('settings', undefined, { location: false }));
            });
        });
    });
    $http.get('/api/mode').then(function (data) {
        var logged_in = data.data.logged_in;
        logged_in_resolver.resolve(logged_in);
        $rootScope.mode = data.data.mode;
        $rootScope.run_config = data.data.run_config;
        var ua;
        if (ua = data.data.run_config.ua) {
            if (data.data.no_usage_stats) analytics_provider.disableAnalytics(true);
            analytics_provider.setAccount({
                tracker: ua.tid,
                set: { forceSSL: true },
                trackEvent: true
            });
            Analytics.registerScriptTags();
            Analytics.registerTrackers();
            _lodash2.default.each(ua._persistentParams, function (v, k) {
                return Analytics.set('&' + k, v);
            });
            Analytics.set('&an', (ua._persistentParams.an || 'LPM') + ' - UI');
        }
        analytics_provider = null;
        _util2.default.init_ga(Analytics);
        if ($window.localStorage.getItem('last_run_id') != $rootScope.run_config.id) {
            $window.localStorage.setItem('last_run_id', $rootScope.run_config.id);
            $window.localStorage.setItem('suppressed_warnings', '');
        }
        $rootScope.login_failure = data.data.login_failure;
        $rootScope.$broadcast('error_update');
        if (logged_in) {
            var p = 60 * 60 * 1000;
            var recheck = function recheck() {
                $http.post('/api/recheck').then(function (r) {
                    if (r.data.login_failure) $window.location = '/';
                });
                setTimeout(recheck, p);
            };
            var t = +(0, _date2.default)();
            setTimeout(recheck, p - t % p);
        }
    });
});

_module.factory('$proxies', proxies_factory);
proxies_factory.$inject = ['$http', '$q'];
function proxies_factory($http, $q) {
    var service = {
        subscribe: subscribe,
        proxies: null,
        trigger: trigger,
        update: update_proxies
    };
    var listeners = [];
    service.update();
    return service;
    function subscribe(func) {
        listeners.push(func);
        if (service.proxies) func(service.proxies);
    }
    function update_proxies() {
        var get_status = function get_status(force) {
            var proxy = this;
            if (!proxy._status_call || force) {
                var url = '/api/proxy_status/' + proxy.port;
                if (proxy.proxy_type != 'duplicate') url += '?with_details';
                proxy._status_call = $http.get(url);
            }
            this._status_call.then(function (res) {
                if (res.data.status == 'ok') {
                    proxy._status = 'ok';
                    proxy._status_details = res.data.status_details || [];
                } else {
                    proxy._status = 'error';
                    var errors = res.data.status_details.filter(function (s) {
                        return s.lvl == 'err';
                    });
                    proxy._status_details = errors.length ? errors : [{ lvl: 'err', msg: res.data.status }];
                }
            }).catch(function () {
                proxy._status_call = null;
                proxy._status = 'error';
                proxy._status_details = [{ lvl: 'warn',
                    msg: 'Failed to get proxy status' }];
            });
        };
        return $http.get('/api/proxies_running').then(function (res) {
            var proxies = res.data;
            proxies.sort(function (a, b) {
                return a.port > b.port ? 1 : -1;
            });
            proxies.forEach(function (proxy) {
                if (Array.isArray(proxy.proxy) && proxy.proxy.length == 1) proxy.proxy = proxy.proxy[0];
                proxy.get_status = get_status;
                proxy._status_details = [];
            });
            service.proxies = proxies;
            listeners.forEach(function (cb) {
                cb(proxies);
            });
            return proxies;
        });
    }
    function trigger() {
        listeners.forEach(function (cb) {
            cb(service.proxies);
        });
    }
}

_module.factory('$www_lum', www_lum_factory);
www_lum_factory.$inject = ['$http', '$timeout'];

function www_lum_factory($http, $timeout) {
    var conf = {};
    var is_listening = false;
    var get_timeout = void 0;
    var www_lum_poll_interval = 500000;
    poll();
    return { conf: conf, listen: listen, stop_listening: stop_listening, combine_presets: combine_presets };

    function listen() {
        if (is_listening) return;
        is_listening = true;
        poll();
    }

    function stop_listening() {
        is_listening = false;
        if (get_timeout) $timeout.cancel(get_timeout);
    }

    function combine_presets(_presets) {
        var www_presets = (conf.presets || []).reduce(function (prs, p) {
            var np = _lodash2.default.cloneDeep(p);
            np.set = function (opt) {
                return _lodash2.default.extend(opt, p.set);
            };
            np.clean = function (opt) {
                return _lodash2.default.extend(opt, p.clean || {});
            };
            np.check = function () {
                return true;
            };
            prs[np.key] = np;
            return prs;
        }, _lodash2.default.cloneDeep(_presets));
        return www_presets;
    }

    function poll() {
        get_www_lum().then(function (res) {
            _lodash2.default.extend(conf, res);
            get_timeout = $timeout(poll, www_lum_poll_interval);
        });
    }
    function get_www_lum() {
        return $http.get('/api/www_lpm').then(function (res) {
            return res.data;
        });
    }
}

_module.factory('$success_rate', success_rate_factory);
success_rate_factory.$inject = ['$http', '$proxies', '$timeout'];

function success_rate_factory($http, $proxies, $timeout) {
    var is_listening = false;
    var get_timeout = false;
    var poll_interval = 3000;
    return { listen: listen, stop_listening: stop_listening };

    function listen() {
        if (is_listening) return;
        is_listening = true;
        poll();
        function poll() {
            get_request_rate().then(function () {
                if (!is_listening) return;
                get_timeout = $timeout(poll, poll_interval);
            });
        }
    }

    function stop_listening() {
        is_listening = false;
        if (get_timeout) $timeout.cancel(get_timeout);
    }

    function get_request_rate() {
        return $http.get('/api/req_status').then(function (res) {
            var rates = res.data;
            if (!$proxies.proxies) return;
            $proxies.proxies = $proxies.proxies.map(function (p) {
                var rstat = { total: 0, success: 0 };
                if ('' + p.port in rates) rstat = rates[p.port];
                p.success_rate = rstat.total == 0 ? 0 : rstat.success / rstat.total * 100;
                p.success_rate = p.success_rate.toFixed(0);
                return p;
            });
            $proxies.trigger();
        });
    }
}

_module.controller('root', ['$rootScope', '$scope', '$http', '$window', '$state', '$transitions', function ($rootScope, $scope, $http, $window, $state, $transitions) {
    $scope.messages = _messages2.default;
    $scope.sections = [{ name: 'settings', title: 'Settings', navbar: false }, { name: 'howto', title: 'How to use', navbar: true }, { name: 'proxies', title: 'Proxies', navbar: true }, { name: 'zones', title: 'Zones', navbar: true }, { name: 'tools', title: 'Tools', navbar: true }, { name: 'faq', title: 'FAQ', navbar: true }, { name: 'intro', navbar: false }];
    $transitions.onSuccess({}, function (transition) {
        var state = transition.to(),
            section;
        $scope.section = section = $scope.sections.find(function (s) {
            return s.name == state.name;
        });
        $scope.subsection = section && section.name == 'zones' && transition.params().zone;
    });
    $scope.section = $scope.sections.find(function (s) {
        return s.name == $state.$current.name;
    });
    $http.get('/api/settings').then(function (settings) {
        $rootScope.settings = settings.data;
        $rootScope.beta_features = settings.data.argv.includes('beta_features');
        if (!$rootScope.settings.request_disallowed && !$rootScope.settings.customer) {
            if (!$window.localStorage.getItem('quickstart')) $window.localStorage.setItem('quickstart', 'show');
        }
    });
    $http.get('/api/ip').then(function (ip) {
        $scope.ip = ip.data.ip;
    });
    $http.get('/api/version').then(function (version) {
        $scope.ver_cur = version.data.version;
    });
    $http.get('/api/last_version').then(function (version) {
        $scope.ver_last = version.data;
    });
    $http.get('/api/consts').then(function (consts) {
        $rootScope.consts = consts.data;
        $scope.$broadcast('consts', consts.data);
    });
    $http.get('/api/node_version').then(function (node) {
        $scope.ver_node = node.data;
    });
    var show_reload = function show_reload() {
        $window.$('#restarting').modal({
            backdrop: 'static',
            keyboard: false
        });
    };
    // XXX krzysztof/ovidiu: incorrect usage of promises
    var check_reload = function check_reload() {
        $http.get('/api/config').catch(function () {
            setTimeout(check_reload, 500);
        }).then(function () {
            $window.location.reload();
        });
    };
    $scope.is_upgradable = function () {
        if (!($scope.ver_node && $scope.ver_node.is_electron) && !is_electron && $scope.ver_last && $scope.ver_last.newer) {
            var version = $window.localStorage.getItem('dismiss_upgrade');
            return version ? $scope.ver_last.version > version : true;
        }
        return false;
    };
    $scope.dismiss_upgrade = function () {
        $window.localStorage.setItem('dismiss_upgrade', $scope.ver_last.version);
    };
    $scope.upgrade = function () {
        $scope.$root.confirmation = {
            text: 'The application will be upgraded and restarted.',
            confirmed: function confirmed() {
                $window.$('#upgrading').modal({ backdrop: 'static',
                    keyboard: false });
                $scope.upgrading = true;
                // XXX krzysztof: wrong usage of promises
                $http.post('/api/upgrade').catch(function () {
                    $scope.upgrading = false;
                    $scope.upgrade_error = true;
                }).then(function (data) {
                    $scope.upgrading = false;
                    // XXX krzysztof: wrong usage of promises
                    $http.post('/api/restart').catch(function () {
                        // $scope.upgrade_error = true;
                        show_reload();
                        check_reload();
                    }).then(function (d) {
                        show_reload();
                        check_reload();
                    });
                });
            }
        };
        $window.$('#confirmation').modal();
    };
    $scope.shutdown = function () {
        $scope.$root.confirmation = {
            text: 'Are you sure you want to shut down the local proxies?',
            confirmed: function confirmed() {
                $http.post('/api/shutdown');
                setTimeout(function () {
                    $window.$('#shutdown').modal({
                        backdrop: 'static',
                        keyboard: false
                    });
                }, 400);
            }
        };
        $window.$('#confirmation').modal();
    };
    $scope.logout = function () {
        $http.post('/api/logout').then(function () {
            show_reload();
            setTimeout(function _check_reload() {
                var retry = function retry() {
                    setTimeout(_check_reload, 500);
                };
                $http.get('/proxies').then(function (res) {
                    $window.location = '/';
                }, retry);
            }, 3000);
        });
    };
    $scope.warnings = function () {
        if (!$rootScope.run_config || !$rootScope.run_config.warnings) return [];
        var suppressed = $window.localStorage.getItem('suppressed_warnings').split('|||');
        var warnings = [];
        for (var i = 0; i < $rootScope.run_config.warnings.length; i++) {
            var w = $rootScope.run_config.warnings[i];
            if (!suppressed.includes(w)) warnings.push(w);
        }
        return warnings;
    };
    $scope.dismiss_warning = function (warning) {
        var warnings = $window.localStorage.getItem('suppressed_warnings').split('|||');
        warnings.push(warning);
        $window.localStorage.setItem('suppressed_warnings', warnings.join('|||'));
    };
    $scope.zone_click = function (name) {
        ga_event('navbar', 'click', name);
    };
}]);

_module.controller('config', Config);
Config.$inject = ['$scope', '$http', '$window'];
function Config($scope, $http, $window) {
    $http.get('/api/config').then(function (config) {
        $scope.config = config.data.config;
        setTimeout(function () {
            $scope.codemirror = _codemirror2.default.fromTextArea($window.$('#config-textarea').get(0), { mode: 'javascript' });
        }, 0);
    });
    var show_reload = function show_reload() {
        $window.$('#restarting').modal({
            backdrop: 'static',
            keyboard: false
        });
    };
    var check_reload = function check_reload() {
        var retry = function retry() {
            setTimeout(check_reload, 500);
        };
        $http.get('/tools').then(function (res) {
            $window.location.reload();
        }, retry);
    };
    $scope.save = function () {
        $scope.errors = null;
        $http.post('/api/config_check', { config: $scope.codemirror.getValue() }).then(function (res) {
            $scope.errors = res.data;
            if ($scope.errors.length) return;
            $scope.$root.confirmation = {
                text: 'Editing the configuration manually may result in your ' + 'proxies working incorrectly. Do you still want to modify' + ' the configuration file?',
                confirmed: function confirmed() {
                    $scope.config = $scope.codemirror.getValue();
                    show_reload();
                    $http.post('/api/config', { config: $scope.config }).then(setTimeout(check_reload, 3000));
                }
            };
            $window.$('#confirmation').modal();
        });
    };
    $scope.update = function () {
        $http.get('/api/config').then(function (config) {
            $scope.config = config.data.config;
            $scope.codemirror.setValue($scope.config);
        });
    };
    $window.$('#config-panel').on('hidden.bs.collapse', $scope.update).on('show.bs.collapse', function () {
        setTimeout(function () {
            $scope.codemirror.scrollTo(0, 0);
            $scope.codemirror.refresh();
        }, 0);
    });
    $scope.cancel = function () {
        $window.$('#config-panel > .collapse').collapse('hide');
    };
}

_module.controller('resolve', Resolve);
Resolve.$inject = ['$scope', '$http', '$window'];
function Resolve($scope, $http, $window) {
    $scope.resolve = { text: '' };
    $scope.update = function () {
        $http.get('/api/resolve').then(function (resolve) {
            $scope.resolve.text = resolve.data.resolve;
        });
    };
    $scope.update();
    var show_reload = function show_reload() {
        $window.$('#restarting').modal({
            backdrop: 'static',
            keyboard: false
        });
    };
    // XXX krzysztof/ovidiu: incorrect usage of promises
    var check_reload = function check_reload() {
        $http.get('/api/config').catch(function () {
            setTimeout(check_reload, 500);
        }).then(function () {
            $window.location.reload();
        });
    };
    $scope.save = function () {
        show_reload();
        $http.post('/api/resolve', { resolve: $scope.resolve.text }).then(check_reload);
    };
    $window.$('#resolve-panel').on('hidden.bs.collapse', $scope.update).on('show.bs.collapse', function () {
        setTimeout(function () {
            $window.$('#resolve-textarea').scrollTop(0).scrollLeft(0);
        }, 0);
    });
    $scope.cancel = function () {
        $window.$('#resolve-panel > .collapse').collapse('hide');
    };
    $scope.new_host = function () {
        $window.$('#resolve_add').one('shown.bs.modal', function () {
            $window.$('#resolve_add input').select();
        }).modal();
    };
    $scope.add_host = function () {
        $scope.adding = true;
        $scope.error = false;
        var host = $scope.host.host.trim();
        $http.get('/api/resolve_host/' + host).then(function (ips) {
            $scope.adding = false;
            if (ips.data.ips && ips.data.ips.length) {
                for (var i = 0; i < ips.data.ips.length; i++) {
                    $scope.resolve.text += '\n' + ips.data.ips[i] + ' ' + host;
                }setTimeout(function () {
                    var textarea = $window.$('#resolve-textarea');
                    textarea.scrollTop(textarea.prop('scrollHeight'));
                }, 0);
                $scope.host.host = '';
                $scope.resolve_frm.$setPristine();
                $window.$('#resolve_add').modal('hide');
            } else $scope.error = true;
        });
    };
}

_module.controller('settings', Settings);
Settings.$inject = ['$scope', '$http', '$window', '$sce', '$rootScope', '$state', '$location'];
function Settings($scope, $http, $window, $sce, $rootScope, $state, $location) {
    var update_error = function update_error() {
        if ($rootScope.relogin_required) return $scope.user_error = { message: 'Please log in again.' };
        if (!$rootScope.login_failure) return;
        switch ($rootScope.login_failure) {
            case 'eval_expired':
                $scope.user_error = { message: 'Evaluation expired!' + '<a href=https://luminati.io/#contact>Please contact your ' + 'Luminati rep.</a>' };
                break;
            case 'invalid_creds':
            case 'unknown':
                $scope.user_error = { message: 'Your proxy is not responding.<br>' + 'Please go to the <a href=https://luminati.io/cp/zones/' + $rootScope.settings.zone + '>zone page</a> and verify that ' + 'your IP address ' + ($scope.$parent.ip ? '(' + $scope.$parent.ip + ')' : '') + ' is in the whitelist.' };
                break;
            default:
                $scope.user_error = { message: $rootScope.login_failure };
        }
    };
    update_error();
    $scope.$on('error_update', update_error);
    $scope.parse_arguments = function (args) {
        return args.replace(/(--password )(.+?)( --|$)/, '$1|||$2|||$3').split('|||');
    };
    $scope.show_password = function () {
        $scope.args_password = true;
    };
    var check_reload = function check_reload() {
        $http.get('/proxies').then(function () {
            $window.location.reload();
        }, function () {
            setTimeout(check_reload, 500);
        });
    };
    var show_reload = function show_reload() {
        $window.$('#restarting').modal({
            backdrop: 'static',
            keyboard: false
        });
    };
    var send_event_user_logged = function send_event_user_logged() {
        if ($window.localStorage.getItem('quickstart-intro') || $window.localStorage.getItem('quickstart') == 'dismissed') {
            ga_event('lpm-onboarding', '02 login successful', 'old user');
        } else ga_event('lpm-onboarding', '02 login successful', 'new user');
    };
    $scope.user_data = { username: '', password: '' };
    var token;
    $scope.save_user = function () {
        var creds = {};
        if (token) creds = { token: token };else {
            var username = $scope.user_data.username;
            var password = $scope.user_data.password;
            if (!(username = username.trim())) {
                $scope.user_error = {
                    message: 'Please enter a valid email address.',
                    username: true };
                return;
            }
            if (!password) {
                $scope.user_error = { message: 'Please enter a password.',
                    password: true };
                return;
            }
            creds = { username: username, password: password };
        }
        $scope.saving_user = true;
        $scope.user_error = null;
        if ($scope.user_customers) creds.customer = $scope.user_data.customer;
        $http.post('/api/creds_user', creds).then(function (d) {
            if (d.data.customers) {
                $scope.saving_user = false;
                $scope.user_customers = d.data.customers;
                $scope.user_data.customer = $scope.user_customers[0];
            } else {
                send_event_user_logged();
                show_reload();
                setTimeout(check_reload, 3000);
            }
        }).catch(function (error) {
            $scope.saving_user = false;
            $scope.user_error = error.data.error;
        });
    };
    $scope.google_click = function (e) {
        var google = $window.$(e.currentTarget),
            l = $window.location;
        google.attr('href', google.attr('href') + '&state=' + encodeURIComponent(l.protocol + '//' + l.hostname + ':' + (l.port || 80) + '?api_version=3'));
    };
    var m,
        qs_regex = /^([a-zA-Z0-9\+\/=]+)$/;
    if (m = ($location.search().t || '').replace(/\s+/g, '+').match(qs_regex)) {
        $scope.google_login = true;
        token = m[1];
        $scope.save_user();
    }
}

_module.controller('zones', Zones);
Zones.$inject = ['$scope', '$http', '$filter', '$window'];
function Zones($scope, $http, $filter, $window) {
    var today = new Date();
    var one_day_ago = new Date().setDate(today.getDate() - 1);
    var two_days_ago = new Date().setDate(today.getDate() - 2);
    var one_month_ago = new Date().setMonth(today.getMonth() - 1, 1);
    var two_months_ago = new Date().setMonth(today.getMonth() - 2, 1);
    $scope.times = [{ title: (0, _moment2.default)(two_months_ago).format('MMM-YYYY'), key: 'back_m2' }, { title: (0, _moment2.default)(one_month_ago).format('MMM-YYYY'), key: 'back_m1' }, { title: (0, _moment2.default)(today).format('MMM-YYYY'), key: 'back_m0' }, { title: (0, _moment2.default)(two_days_ago).format('DD-MMM-YYYY'), key: 'back_d2' }, { title: (0, _moment2.default)(one_day_ago).format('DD-MMM-YYYY'), key: 'back_d1' }, { title: (0, _moment2.default)(today).format('DD-MMM-YYYY'), key: 'back_d0' }];
    var number_filter = $filter('requests');
    var size_filter = $filter('bytes');
    $scope.fields = [{ key: 'http_svc_req', title: 'HTTP', filter: number_filter }, { key: 'https_svc_req', title: 'HTTPS', filter: number_filter }, { key: 'bw_up', title: 'Upload', filter: size_filter }, { key: 'bw_dn', title: 'Download', filter: size_filter }, { key: 'bw_sum', title: 'Total Bandwidth', filter: size_filter }];
    $http.get('/api/stats').then(function (stats) {
        if (stats.data.login_failure) {
            $window.location = '/';
            return;
        }
        $scope.stats = stats.data;
        if (!Object.keys($scope.stats).length) $scope.error = true;
    }).catch(function (e) {
        $scope.error = true;
    });
    $http.get('/api/whitelist').then(function (whitelist) {
        $scope.whitelist = whitelist.data;
    });
    $http.get('/api/recent_ips').then(function (recent_ips) {
        $scope.recent_ips = recent_ips.data;
    });
    $scope.edit_zone = function (zone) {
        $window.location = 'https://luminati.io/cp/zones/' + zone;
    };
}

_module.controller('faq', Faq);
Faq.$inject = ['$scope'];
function Faq($scope) {
    $scope.questions = [{
        name: 'links',
        title: 'More info on the Luminati proxy manager'
    }, {
        name: 'upgrade',
        title: 'How can I upgrade Luminati proxy manager tool?'
    }, {
        name: 'ssl',
        title: 'How do I enable HTTPS analyzing?'
    }];
}

_module.controller('test', Test);
Test.$inject = ['$scope', '$http', '$filter', '$window'];
function Test($scope, $http, $filter, $window) {
    if (qs_o.action && qs_o.action == 'test_proxy') $scope.expand = true;
    var preset = JSON.parse(decodeURIComponent(($window.location.search.match(/[?&]test=([^&]+)/) || ['', 'null'])[1]));
    if (preset) {
        $scope.expand = true;
        $scope.proxy = '' + preset.port;
        $scope.url = preset.url;
        $scope.method = preset.method;
        $scope.body = preset.body;
    } else {
        $scope.method = 'GET';
        $scope.url = $scope.$root.settings.test_url;
    }
    $http.get('/api/proxies').then(function (proxies) {
        $scope.proxies = [['0', 'No proxy']];
        proxies.data.sort(function (a, b) {
            return a.port > b.port ? 1 : -1;
        });
        for (var i = 0; i < proxies.data.length; i++) {
            $scope.proxies.push(['' + proxies.data[i].port, '' + proxies.data[i].port]);
        }
        if (!$scope.proxy) $scope.proxy = $scope.proxies[1][0];
    });
    $scope.methods = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW'];
    $scope.request = {};
    $scope.go = function (proxy, url, method, headers, body) {
        var headers_obj = {};
        headers.forEach(function (h) {
            headers_obj[h.key] = h.value;
        });
        var req = {
            method: 'POST',
            url: '/api/test/' + proxy,
            data: {
                url: url,
                method: method,
                headers: headers_obj,
                body: body
            }
        };
        $scope.loading = true;
        $http(req).then(function (r) {
            $scope.loading = false;
            r = r.data;
            if (!r.error) {
                r.response.headers = Object.keys(r.response.headers).sort().map(function (key) {
                    return [key, r.response.headers[key]];
                });
            }
            $scope.request = r;
        });
    };
    $scope.headers = preset && preset.headers ? Object.keys(preset.headers).map(function (h) {
        return { key: h, value: preset.headers[h] };
    }) : [];
    $scope.add_header = function () {
        $scope.headers.push({ key: '', value: '' });
    };
    $scope.remove_header = function (index) {
        $scope.headers.splice(index, 1);
    };
    $scope.reset = function () {
        $scope.headers = [];
    };
}

_module.controller('test-ports', ['$scope', '$http', '$filter', '$window', function ($scope, $http, $filter, $window) {
    var preset = JSON.parse(decodeURIComponent(($window.location.search.match(/[?&]test-ports=([^&]+)/) || ['', 'null'])[1]));
    if (preset) $scope.proxy = '' + preset.port;
    $http.get('/api/proxies').then(function (proxies) {
        $scope.proxies = [['0', 'All proxies']];
        proxies.data.sort(function (a, b) {
            return a.port > b.port ? 1 : -1;
        });
        for (var i = 0; i < proxies.data.length; i++) {
            $scope.proxies.push(['' + proxies.data[i].port, '' + proxies.data[i].port]);
        }
        if (!$scope.proxy) $scope.proxy = $scope.proxies[1][0];
    });
    $scope.request = {};
    $scope.go = function (proxy) {
        $scope.reset();
        var req = {
            method: 'GET',
            url: '/api/test-ports?ports=' + (+proxy == 0 ? $scope.proxies.map(function (p) {
                return +p[0];
            }).filter(Boolean).join(',') : proxy)
        };
        $scope.loading = true;
        $http(req).then(function (r) {
            $scope.loading = false;
            r = r.data;
            if (!r.error) {
                for (var port in r) {
                    $scope.request[port] = r[port];
                }
            }
            $scope.request.responses = [];
            for (var p in $scope.request) {
                if (!+p) continue;
                var response = $scope.request[p].response || $scope.request[p].error;
                $scope.request.responses.push({
                    proxy: p,
                    body: response.body || { pass: false },
                    ts: response.ts || +new Date()
                });
            }
        });
    };
    $scope.reset = function () {
        $scope.request = {};
    };
}]);

_module.controller('countries', Countries);
Countries.$inject = ['$scope', '$http', '$window'];
function Countries($scope, $http, $window) {
    $scope.url = '';
    $scope.ua = '';
    $scope.path = '';
    $scope.headers = [];
    $scope.started = 0;
    $scope.num_loading = 0;
    $scope.add_header = function () {
        $scope.headers.push({ key: '', value: '' });
    };
    $scope.remove_header = function (index) {
        $scope.headers.splice(index, 1);
    };
    var normalize_headers = function normalize_headers(headers) {
        var result = {};
        for (var h in headers) {
            result[headers[h].key] = headers[h].value;
        }return result;
    };
    $scope.go = function () {
        var process = function process() {
            $scope.started++;
            $scope.countries = [];
            var max_concur = 4;
            $scope.num_loading = 0;
            $scope.cur_index = 0;
            var progress = function progress(apply) {
                while ($scope.cur_index < $scope.countries.length && $scope.num_loading < max_concur) {
                    if (!$scope.countries[$scope.cur_index].status) {
                        $scope.countries[$scope.cur_index].status = 1;
                        $scope.countries[$scope.cur_index].img.src = $scope.countries[$scope.cur_index].url;
                        $scope.num_loading++;
                    }
                    $scope.cur_index++;
                }
                if (apply) $scope.$apply();
            };
            var nheaders = JSON.stringify(normalize_headers($scope.headers));
            for (var c_index in $scope.$root.consts.proxy.country.values) {
                var c = $scope.$root.consts.proxy.country.values[c_index];
                if (!c.value) continue;
                var params = {
                    country: c.value,
                    url: $scope.url,
                    path: $scope.path,
                    ua: $scope.ua,
                    headers: nheaders
                };
                var nparams = [];
                for (var p in params) {
                    nparams.push(p + '=' + encodeURIComponent(params[p]));
                }var data = {
                    code: c.value,
                    name: c.key,
                    status: 0,
                    url: '/api/country?' + nparams.join('&'),
                    img: new Image(),
                    index: $scope.countries.length
                };
                data.img.onerror = function (started) {
                    return function () {
                        if ($scope.started != started) return;
                        data.status = 3;
                        $scope.num_loading--;
                        progress(true);
                    };
                }($scope.started);
                data.img.onload = function (started) {
                    return function () {
                        if ($scope.started != started) return;
                        data.status = 4;
                        $scope.num_loading--;
                        progress(true);
                    };
                }($scope.started);
                $scope.countries.push(data);
            }
            progress(false);
        };
        if ($scope.started) {
            $scope.$root.confirmation = {
                text: 'The currently made screenshots will be lost. ' + 'Do you want to continue?',
                confirmed: process
            };
            $window.$('#confirmation').modal();
        } else process();
    };
    $scope.view = function (country) {
        $scope.screenshot = {
            country: country.name,
            url: country.url
        };
        $window.$('#countries-screenshot').one('shown.bs.modal', function () {
            $window.$('#countries-screenshot .modal-body > div').scrollTop(0).scrollLeft(0);
        }).modal();
    };
    $scope.cancel = function (country) {
        if (!country.status) country.status = 2;else if (country.status == 1) country.img.src = '';
    };
    $scope.cancel_all = function () {
        $scope.$root.confirmation = {
            text: 'Do you want to stop all the remaining countries?',
            confirmed: function confirmed() {
                for (var c_i = $scope.countries.length - 1; c_i >= 0; c_i--) {
                    var country = $scope.countries[c_i];
                    if (country.status < 2) $scope.cancel(country);
                }
            }
        };
        $window.$('#confirmation').modal();
    };
    $scope.retry = function (country) {
        if ($scope.cur_index > country.index) {
            country.status = 1;
            // XXX colin/ovidiu: why not use urlencoding?
            country.url = country.url.replace(/&\d+$/, '') + '&' + +(0, _date2.default)();
            $scope.num_loading++;
            country.img.src = country.url;
        } else country.status = 0;
    };
}

_module.filter('startFrom', function () {
    return function (input, start) {
        return input.slice(+start);
    };
});

function check_by_re(r, v) {
    return (v = v.trim()) && r.test(v);
}
var check_number = check_by_re.bind(null, /^\d+$/);
function check_reg_exp(v) {
    try {
        return (v = v.trim()) || new RegExp(v, 'i');
    } catch (e) {
        return false;
    }
}

var presets = {
    session_long: {
        title: 'Long single session (IP)',
        check: function check(opt) {
            return !opt.pool_size && !opt.sticky_ipo && opt.session === true && opt.keep_alive;
        },
        set: function set(opt) {
            opt.pool_size = 0;
            opt.ips = [];
            opt.keep_alive = opt.keep_alive || 50;
            opt.pool_type = undefined;
            opt.sticky_ip = false;
            opt.session = true;
            if (opt.session === true) opt.seed = false;
        },
        support: {
            keep_alive: true,
            multiply: true,
            session_ducation: true,
            max_requests: true
        }
    },
    session: {
        title: 'Single session (IP)',
        check: function check(opt) {
            return !opt.pool_size && !opt.sticky_ip && opt.session === true && !opt.keep_alive;
        },
        set: function set(opt) {
            opt.pool_size = 0;
            opt.ips = [];
            opt.keep_alive = 0;
            opt.pool_type = undefined;
            opt.sticky_ip = false;
            opt.session = true;
            if (opt.session === true) opt.seed = false;
        },
        support: {
            multiply: true,
            session_duration: true,
            max_requests: true
        }
    },
    sticky_ip: {
        title: 'Session (IP) per machine',
        check: function check(opt) {
            return !opt.pool_size && opt.sticky_ip;
        },
        set: function set(opt) {
            opt.pool_size = 0;
            opt.ips = [];
            opt.pool_type = undefined;
            opt.sticky_ip = true;
            opt.session = undefined;
            opt.multiply = undefined;
        },
        support: {
            keep_alive: true,
            max_requests: true,
            session_duration: true,
            seed: true
        }
    },
    sequential: {
        title: 'Sequential session (IP) pool',
        check: function check(opt) {
            return opt.pool_size && (!opt.pool_type || opt.pool_type == 'sequential');
        },
        set: function set(opt) {
            opt.pool_size = opt.pool_size || 1;
            opt.pool_type = 'sequential';
            opt.sticky_ip = undefined;
            opt.session = undefined;
        },
        support: {
            pool_size: true,
            keep_alive: true,
            max_requests: true,
            session_duration: true,
            multiply: true,
            seed: true
        }
    },
    round_robin: {
        title: 'Round-robin (IP) pool',
        check: function check(opt) {
            return opt.pool_size && opt.pool_type == 'round-robin' && !opt.multiply;
        },
        set: function set(opt) {
            opt.pool_size = opt.pool_size || 1;
            opt.pool_type = 'round-robin';
            opt.sticky_ip = undefined;
            opt.session = undefined;
            opt.multiply = undefined;
        },
        support: {
            pool_size: true,
            keep_alive: true,
            max_requests: true,
            session_duration: true,
            seed: true
        }
    },
    custom: {
        title: 'Custom',
        check: function check(opt) {
            return true;
        },
        set: function set(opt) {},
        support: {
            session: true,
            sticky_ip: true,
            pool_size: true,
            pool_type: true,
            keep_alive: true,
            max_requests: true,
            session_duration: true,
            multiply: true,
            seed: true
        }
    }
};
for (var k in presets) {
    if (!presets[k].clean) presets[k].clean = function (opt) {
        return opt;
    };
    presets[k].key = k;
}

_module.controller('proxies', Proxies);
Proxies.$inject = ['$scope', '$rootScope', '$http', '$proxies', '$window', '$q', '$timeout', '$stateParams', '$success_rate', '$www_lum'];
function Proxies($scope, $root, $http, $proxies, $window, $q, $timeout, $stateParams, $success_rate, $www_lum) {
    var prepare_opts = function prepare_opts(opt) {
        return opt.map(function (o) {
            return { key: o, value: o };
        });
    };
    $success_rate.listen();
    $www_lum.listen();
    $scope.$on('$destroy', function () {
        $success_rate.stop_listening();
        $www_lum.stop_listening();
    });
    var iface_opts = [],
        zone_opts = [];
    var country_opts = [],
        region_opts = {},
        cities_opts = {};
    var pool_type_opts = [],
        dns_opts = [],
        log_opts = [],
        debug_opts = [];
    $scope.presets = presets;
    var opt_columns = [{
        key: 'port',
        title: 'Port',
        type: 'number',
        check: function check(v, config) {
            if (check_number(v) && v >= 24000) {
                var conflicts = $proxies.proxies.filter(function (proxy) {
                    return proxy.port == v && proxy.port != config.port;
                });
                return !conflicts.length;
            }
            return false;
        }
    }, {
        key: '_status',
        title: 'Status',
        type: 'status'
    }, {
        key: 'iface',
        title: 'Interface',
        type: 'options',
        options: function options() {
            return iface_opts;
        }
    }, {
        key: 'multiply',
        title: 'Multiple',
        type: 'number'
    }, {
        key: 'history',
        title: 'History',
        type: 'boolean'
    }, {
        key: 'ssl',
        title: 'SSL analyzing',
        type: 'boolean'
    }, {
        key: 'socks',
        title: 'SOCKS port',
        type: 'number',
        check: check_number
    }, {
        key: 'zone',
        title: 'Zone',
        type: 'options',
        options: function options() {
            return zone_opts;
        }
    }, {
        key: 'secure_proxy',
        title: 'SSL for super proxy',
        type: 'boolean'
    }, {
        key: 'country',
        title: 'Country',
        type: 'options',
        options: function options(proxy) {
            if (proxy && proxy.zone == 'static') {
                return country_opts.filter(function (c) {
                    return ['', 'br', 'de', 'gb', 'au', 'us'].includes(c.value);
                });
            }
            return country_opts;
        }
    }, {
        key: 'state',
        title: 'State',
        type: 'options',
        options: function options(proxy) {
            return load_regions(proxy.country);
        }
    }, {
        key: 'city',
        title: 'City',
        type: 'autocomplete',
        check: function check() {
            return true;
        },
        options: function options(proxy, view_val) {
            var cities = load_cities(proxy);
            if (!view_val) return cities;
            return cities.filter(function (c) {
                return c.value.toLowerCase().startsWith(view_val.toLowerCase());
            });
        }
    }, {
        key: 'asn',
        title: 'ASN',
        type: 'number',
        check: function check(v) {
            return check_number(v) && v < 400000;
        }
    }, {
        key: 'ip',
        title: 'Datacenter IP',
        type: 'text',
        check: function check(v) {
            if (!(v = v.trim())) return true;
            var m = v.match(/^(\d+)\.(\d+)\.(\d+)\.(\d+)$/);
            if (!m) return false;
            for (var i = 1; i <= 4; i++) {
                if (m[i] !== '0' && m[i].charAt(0) == '0' || m[i] > 255) return false;
            }
            return true;
        }
    }, {
        key: 'vip',
        title: 'VIP',
        type: 'number',
        check: function check(v) {
            return true;
        }
    }, {
        key: 'max_requests',
        title: 'Max requests',
        type: 'text',
        check: function check(v) {
            return !v || check_by_re(/^\d+(:\d*)?$/, v);
        }
    }, {
        key: 'session_duration',
        title: 'Session duration (sec)',
        type: 'text',
        check: function check(v) {
            return !v || check_by_re(/^\d+(:\d*)?$/, v);
        }
    }, {
        key: 'pool_size',
        title: 'Pool size',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'pool_type',
        title: 'Pool type',
        type: 'options',
        options: function options() {
            return pool_type_opts;
        }
    }, {
        key: 'sticky_ip',
        title: 'Sticky IP',
        type: 'boolean'
    }, {
        key: 'keep_alive',
        title: 'Keep-alive',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'seed',
        title: 'Seed',
        type: 'text',
        check: function check(v) {
            return !v || check_by_re(/^[^\.\-]*$/, v);
        }
    }, {
        key: 'session',
        title: 'Session',
        type: 'text',
        check: function check(v) {
            return !v || check_by_re(/^[^\.\-]*$/, v);
        }
    }, {
        key: 'allow_proxy_auth',
        title: 'Allow request authentication',
        type: 'boolean'
    }, {
        key: 'session_init_timeout',
        title: 'Session init timeout (sec)',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'proxy_count',
        title: 'Min number of super proxies',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'dns',
        title: 'DNS',
        type: 'options',
        options: function options() {
            return dns_opts;
        }
    }, {
        key: 'log',
        title: 'Log Level',
        type: 'options',
        options: function options() {
            return log_opts;
        }
    }, {
        key: 'proxy_switch',
        title: 'Autoswitch super proxy on failure',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'throttle',
        title: 'Throttle concurrent connections',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'request_timeout',
        title: 'Request timeout (sec)',
        type: 'number',
        check: function check(v) {
            return !v || check_number(v);
        }
    }, {
        key: 'debug',
        title: 'Debug info',
        type: 'options',
        options: function options() {
            return debug_opts;
        }
    }, {
        key: 'null_response',
        title: 'NULL response',
        type: 'text',
        check: check_reg_exp
    }, {
        key: 'bypass_proxy',
        title: 'Bypass proxy',
        type: 'text',
        check: check_reg_exp
    }, {
        key: 'direct_include',
        title: 'Direct include',
        type: 'text',
        check: check_reg_exp
    }, {
        key: 'direct_exclude',
        title: 'Direct exclude',
        type: 'text',
        check: check_reg_exp
    }, {
        key: 'success_rate',
        title: 'Success rate',
        type: 'success_rate'
    }];
    var default_cols = {
        port: true,
        _status: true,
        zone: true,
        country: true,
        city: true,
        state: true,
        success_rate: true
    };
    $scope.cols_conf = JSON.parse($window.localStorage.getItem('columns')) || _lodash2.default.cloneDeep(default_cols);
    $scope.$watch('cols_conf', function () {
        $scope.columns = opt_columns.filter(function (col) {
            return col.key.match(/^_/) || $scope.cols_conf[col.key];
        });
    }, true);
    var apply_consts = function apply_consts(data) {
        iface_opts = data.iface.values;
        zone_opts = data.zone.values;
        country_opts = data.country.values;
        pool_type_opts = data.pool_type.values;
        dns_opts = prepare_opts(data.dns.values);
        log_opts = data.log.values;
        debug_opts = data.debug.values;
    };
    $scope.$on('consts', function (e, data) {
        apply_consts(data.proxy);
    });
    if ($scope.$root.consts) apply_consts($scope.$root.consts.proxy);
    $scope.zones = {};
    $scope.selected_proxies = {};
    $scope.showed_status_proxies = {};
    $scope.pagination = { page: 1, per_page: 10 };
    $scope.set_page = function () {
        var page = $scope.pagination.page;
        var per_page = $scope.pagination.per_page;
        if (page < 1) page = 1;
        if (page * per_page > $scope.proxies.length) page = Math.ceil($scope.proxies.length / per_page);
        $scope.pagination.page = page;
    };
    $proxies.subscribe(function (proxies) {
        $scope.proxies = proxies;
        $scope.set_page();
        proxies.forEach(function (p) {
            $scope.showed_status_proxies[p.port] = $scope.showed_status_proxies[p.port] && p._status_details.length;
        });
    });
    $scope.delete_proxies = function (proxy) {
        $scope.$root.confirmation = {
            text: 'Are you sure you want to delete the proxy?',
            confirmed: function confirmed() {
                var selected = proxy ? [proxy] : $scope.get_selected_proxies();
                var promises = $scope.proxies.filter(function (p) {
                    return p.proxy_type == 'persist' && selected.includes(p.port);
                }).map(function (p) {
                    return $http.delete('/api/proxies/' + p.port);
                });
                $scope.selected_proxies = {};
                $q.all(promises).then(function () {
                    return $proxies.update();
                });
            }
        };
        $window.$('#confirmation').modal();
        ga_event('page: proxies', 'click', 'delete proxy');
    };
    $scope.refresh_sessions = function (proxy) {
        $http.post('/api/refresh_sessions/' + proxy.port).then(function () {
            return $proxies.update();
        });
    };
    $scope.show_history = function (proxy) {
        $scope.history_dialog = [{ port: proxy.port }];
    };
    $scope.show_pool = function (proxy) {
        $scope.pool_dialog = [{
            port: proxy.port,
            sticky_ip: proxy.sticky_ip,
            pool_size: proxy.pool_size
        }];
    };
    $scope.add_proxy = function () {
        $scope.proxy_dialog = [{ proxy: {} }];
        ga_event('page: proxies', 'click', 'add proxy');
    };
    $scope.add_proxy_new = function () {
        (0, _jquery2.default)('#add_proxy_modal').modal('show');
    };
    $scope.edit_proxy_new = function (proxy) {
        $root.edit_proxy = proxy;
    };
    $scope.get_static_country = function (proxy) {
        var zone = proxy.zones[proxy.zone];
        if (!zone) return false;
        var plan = zone.plans[zone.plans.length - 1];
        if (plan.type == 'static') return plan.country || 'any';
        if (plan.vip == 1) return plan.vip_country || 'any';
        return false;
    };
    $scope.edit_proxy = function (duplicate, proxy) {
        var port = proxy.port || $scope.get_selected_proxies()[0];
        proxy = proxy ? [proxy] : $scope.proxies.filter(function (p) {
            return p.port == port;
        });
        $scope.proxy_dialog = [{ proxy: proxy[0].config, duplicate: duplicate }];
        ga_event('page: proxies', 'click', 'edit proxy');
    };
    $scope.edit_cols = function () {
        $scope.columns_dialog = [{
            columns: opt_columns.filter(function (col) {
                return !col.key.match(/^_/);
            }),
            cols_conf: $scope.cols_conf,
            default_cols: default_cols
        }];
        ga_event('page: proxies', 'click', 'edit columns');
    };
    $scope.download_csv = function () {
        var data = $scope.proxies.map(function (p) {
            return ['127.0.0.1:' + p.port];
        });
        ga_event('page: proxies', 'click', 'export_csv');
        _fileSaver2.default.saveAs(_csv2.default.to_blob(data), 'proxies.csv');
    };
    $scope.success_rate_hover = function (rate) {
        ga_event('page: proxies', 'hover', 'success_rate', rate);
    };
    $scope.inline_edit_click = function (proxy, col) {
        if (proxy.proxy_type != 'persist' || !$scope.is_valid_field(proxy, col.key) || $scope.get_static_country(proxy) && col.key == 'country') {
            return;
        }
        switch (col.type) {
            case 'number':
            case 'text':
            case 'autocomplete':
            case 'options':
                proxy.edited_field = col.key;break;
            case 'boolean':
                var config = _lodash2.default.cloneDeep(proxy.config);
                config[col.key] = !proxy[col.key];
                config.proxy_type = 'persist';
                $http.put('/api/proxies/' + proxy.port, { proxy: config }).then(function () {
                    $proxies.update();
                });
                break;
        }
    };
    $scope.inline_edit_input = function (proxy, col, event) {
        if (event.which == 27) return $scope.inline_edit_blur(proxy, col);
        var v = event.currentTarget.value;
        var p = $window.$(event.currentTarget).closest('.proxies-table-input');
        if (col.check(v, proxy.config)) p.removeClass('has-error');else return p.addClass('has-error');
        if (event.which != 13) return;
        v = v.trim();
        if (proxy.original && proxy.original[col.key] !== undefined && proxy.original[col.key].toString() == v) {
            return $scope.inline_edit_blur(proxy, col);
        }
        if (col.type == 'number' && v) v = +v;
        var config = _lodash2.default.cloneDeep(proxy.config);
        config[col.key] = v;
        config.proxy_type = 'persist';
        $http.post('/api/proxy_check/' + proxy.port, config).then(function (res) {
            var errors = res.data.filter(function (i) {
                return i.lvl == 'err';
            });
            if (!errors.length) return $http.put('/api/proxies/' + proxy.port, { proxy: config });
        }).then(function (res) {
            if (res) $proxies.update();
        });
    };
    $scope.inline_edit_select = function (proxy, col, event) {
        if (event.which == 27) return $scope.inline_edit_blur(proxy, col);
    };
    $scope.inline_edit_set = function (proxy, col, v) {
        if (proxy.original[col.key] === v || proxy.original[col.key] == v && v !== true) return $scope.inline_edit_blur(proxy, col);
        var config = _lodash2.default.cloneDeep(proxy.config);
        config[col.key] = v;
        config.proxy_type = 'persist';
        if (col.key == 'country') config.state = config.city = '';
        if (col.key == 'state') config.city = '';
        if (col.key == 'zone' && $scope.consts) {
            var zone;
            if (zone = $scope.consts.proxy.zone.values.find(_lodash2.default.matches({ zone: v }))) {
                config.password = zone.password;
                var plan = zone.plans[zone.plans.length - 1];
                if (!plan.city) config.state = config.city = '';
            }
        }
        $http.put('/api/proxies/' + proxy.port, { proxy: config }).then(function () {
            $proxies.update();
        });
    };
    $scope.inline_edit_blur = function (proxy, col) {
        $timeout(function () {
            if (proxy.original) proxy.config[col.key] = proxy.original[col.key];
            if (proxy.edited_field == col.key) proxy.edited_field = '';
        }, 100);
    };
    $scope.inline_edit_start = function (proxy, col) {
        if (!proxy.original) proxy.original = _lodash2.default.cloneDeep(proxy.config);
        if (col.key == 'session' && proxy.config.session === true) proxy.config.session = '';
    };
    $scope.get_selected_proxies = function () {
        return Object.keys($scope.selected_proxies).filter(function (p) {
            return $scope.selected_proxies[p];
        }).map(function (p) {
            return +p;
        });
    };
    $scope.is_action_available = function (action, port) {
        var proxies = $scope.get_selected_proxies() || port ? [port] : [];
        if (!proxies.length) return false;
        if (action == 'duplicate') return proxies.length == 1;
        if (port) return port.proxy_type == 'persist';
        return !$scope.proxies.some(function (sp) {
            return $scope.selected_proxies[sp.port] && sp.proxy_type != 'persist';
        });
    };
    $scope.option_key = function (col, val) {
        var opt = col.options().find(function (o) {
            return o.value == val;
        });
        return opt && opt.key;
    };
    $scope.toggle_proxy_status_details = function (proxy) {
        if (proxy._status_details.length) {
            $scope.showed_status_proxies[proxy.port] = !$scope.showed_status_proxies[proxy.port];
        }
    };
    $scope.get_colspans = function () {
        for (var i = 0; i < $scope.columns.length; i++) {
            if ($scope.columns[i].key == '_status') return [i + 1, $scope.columns.length - i + 1];
        }
        return [0, 0];
    };
    $scope.get_column_tooltip = function (proxy, col) {
        if (proxy.proxy_type != 'persist') return 'This proxy\'s settings cannot be changed';
        if (!$scope.is_valid_field(proxy, col.key)) {
            return 'You don\'t have \'' + col.key + '\' permission.<br>' + 'Please contact your success manager.';
        }
        if (col.key == 'country' && $scope.get_static_country(proxy)) {
            return $scope.option_key(col, $scope.get_static_country(proxy)) || 'Any country';
        }
        if (col.key == 'country') return $scope.option_key(col, proxy[col.key]);
        if (col.key == 'session' && proxy.session === true) return 'Random';
        if (['state', 'city'].includes(col.key) && [undefined, '', '*'].includes(proxy.country)) {
            return 'Set the country first';
        }
        var config_val = proxy.config[col.key];
        var real_val = proxy[col.key];
        if (real_val && real_val !== config_val) return 'Set non-default value';
        return 'Change value';
    };
    $scope.is_valid_field = function (proxy, name) {
        if (!$scope.$root.consts) return true;
        return is_valid_field(proxy, name, $scope.$root.consts.proxy.zone);
    };
    $scope.starts_with = function (actual, expected) {
        return expected.length > 1 && actual.toLowerCase().startsWith(expected.toLowerCase());
    };
    $scope.typeahead_on_select = function (proxy, col, item) {
        if (col.key == 'city') {
            var config = _lodash2.default.cloneDeep(proxy.config);
            if (item.value == '' || item.value == '*') config.city = '';else config.city = item.key;
            config.state = item.region || '';
            $http.put('/api/proxies/' + proxy.port, { proxy: config }).then(function () {
                $proxies.update();
            });
        }
    };
    $scope.on_page_change = function () {
        $scope.selected_proxies = {};
    };
    $scope.show_add_proxy = function () {
        return JSON.parse($window.localStorage.getItem('add_proxy'));
    };
    var load_regions = function load_regions(country) {
        if (!country || country == '*') return [];
        return region_opts[country] || (region_opts[country] = $http.get('/api/regions/' + country.toUpperCase()).then(function (r) {
            return region_opts[country] = r.data;
        }));
    };
    var load_cities = function load_cities(proxy) {
        var country = proxy.country || ''.toUpperCase();
        var state = proxy.state;
        if (!country || country == '*') return [];
        if (!cities_opts[country]) {
            cities_opts[country] = [];
            $http.get('/api/cities/' + country).then(function (res) {
                cities_opts[country] = res.data.map(function (city) {
                    if (city.region) city.value = city.value + ' (' + city.region + ')';
                    return city;
                });
                return cities_opts[country];
            });
        }
        var options = cities_opts[country];
        // XXX maximk: temporary disable filter by state
        if (false) {
            options = options.filter(function (i) {
                return i.region == state;
            });
        }
        return options;
    };
    $scope.react_component = _stats2.default;
    $scope.add_proxy_modal = _add_proxy2.default;
    if ($stateParams.add_proxy || qs_o.action && qs_o.action == 'tutorial_add_proxy') {
        setTimeout($scope.add_proxy);
    }
}

_module.controller('history', History);
History.$inject = ['$scope', '$http', '$window'];
function History($scope, $http, $window) {
    $scope.hola_headers = [];
    $http.get('/api/hola_headers').then(function (h) {
        $scope.hola_headers = h.data;
    });
    $scope.init = function (locals) {
        var loader_delay = 100;
        var timestamp_changed_by_select = false;
        $scope.initial_loading = true;
        $scope.port = locals.port;
        $scope.show_modal = function () {
            $window.$('#history').modal();
        };
        $http.get('/api/history_context/' + locals.port).then(function (c) {
            $scope.history_context = c.data;
        });
        $scope.periods = [{ label: 'all time', value: '*' }, { label: '1 year', value: { y: 1 } }, { label: '3 months', value: { M: 3 } }, { label: '2 months', value: { M: 2 } }, { label: '1 month', value: { M: 1 } }, { label: '1 week', value: { w: 1 } }, { label: '3 days', value: { d: 3 } }, { label: '1 day', value: { d: 1 } }, { label: 'custom', value: '' }];
        $scope.fields = [{
            field: 'url',
            title: 'Url',
            type: 'string',
            filter_label: 'URL or substring'
        }, {
            field: 'method',
            title: 'Method',
            type: 'options',
            filter_label: 'Request method'
        }, {
            field: 'status_code',
            title: 'Code',
            type: 'number',
            filter_label: 'Response code'
        }, {
            field: 'timestamp',
            title: 'Time',
            type: 'daterange'
        }, {
            field: 'elapsed',
            title: 'Elapsed',
            type: 'numrange'
        }, {
            field: 'country',
            title: 'Country',
            type: 'options',
            filter_label: 'Node country'
        }, {
            field: 'super_proxy',
            title: 'Super Proxy',
            type: 'string',
            filter_label: 'Super proxy or substring'
        }, {
            field: 'proxy_peer',
            title: 'Proxy Peer',
            type: 'string',
            filter_label: 'IP or substring'
        }, {
            field: 'context',
            title: 'Context',
            type: 'options',
            filter_label: 'Request context'
        }];
        $scope.sort_field = 'timestamp';
        $scope.sort_asc = false;
        $scope.virtual_filters = { period: $scope.periods[0].value };
        $scope.filters = {
            url: '',
            method: '',
            status_code: '',
            timestamp: '',
            timestamp_min: null,
            timestamp_max: null,
            elapsed: '',
            elapsed_min: '',
            elapsed_max: '',
            country: '',
            super_proxy: '',
            proxy_peer: '',
            context: ''
        };
        $scope.pagination = {
            page: 1,
            per_page: 10,
            total: 1
        };
        $scope.update = function (export_type) {
            var params = { sort: $scope.sort_field };
            if (!export_type) {
                params.limit = $scope.pagination.per_page;
                params.skip = ($scope.pagination.page - 1) * $scope.pagination.per_page;
            }
            if (!$scope.sort_asc) params.sort_desc = 1;
            if ($scope.filters.url) params.url = $scope.filters.url;
            if ($scope.filters.method) params.method = $scope.filters.method;
            if ($scope.filters.status_code) params.status_code = $scope.filters.status_code;
            if ($scope.filters.timestamp_min) {
                params.timestamp_min = (0, _moment2.default)($scope.filters.timestamp_min, 'YYYY/MM/DD').valueOf();
            }
            if ($scope.filters.timestamp_max) {
                params.timestamp_max = (0, _moment2.default)($scope.filters.timestamp_max, 'YYYY/MM/DD').add(1, 'd').valueOf();
            }
            if ($scope.filters.elapsed_min) params.elapsed_min = $scope.filters.elapsed_min;
            if ($scope.filters.elapsed_max) params.elapsed_max = $scope.filters.elapsed_max;
            if ($scope.filters.country) params.country = $scope.filters.country;
            if ($scope.filters.super_proxy) params.super_proxy = $scope.filters.super_proxy;
            if ($scope.filters.proxy_peer) params.proxy_peer = $scope.filters.proxy_peer;
            if ($scope.filters.context) params.context = $scope.filters.context;
            var params_arr = [];
            for (var param in params) {
                params_arr.push(param + '=' + encodeURIComponent(params[param]));
            }var url = '/api/history';
            if (export_type == 'har' || export_type == 'csv') url += '_' + export_type;
            url += '/' + locals.port + '?' + params_arr.join('&');
            if (export_type) return $window.location = url;
            $scope.loading = +(0, _date2.default)();
            setTimeout(function () {
                $scope.$apply();
            }, loader_delay);
            $http.get(url).then(function (res) {
                $scope.pagination.total_items = res.data.total;
                var history = res.data.items;
                $scope.initial_loading = false;
                $scope.loading = false;
                $scope.history = history.map(function (r) {
                    var alerts = [];
                    var disabled_alerts = [];
                    var add_alert = function add_alert(alert) {
                        if (localStorage.getItem('request-alert-disabled-' + alert.type)) {
                            disabled_alerts.push(alert);
                        } else alerts.push(alert);
                    };
                    var raw_headers = JSON.parse(r.request_headers);
                    var request_headers = {};
                    for (var h in raw_headers) {
                        request_headers[h.toLowerCase()] = raw_headers[h];
                    }r.request_headers = request_headers;
                    r.response_headers = JSON.parse(r.response_headers);
                    r.alerts = alerts;
                    r.disabled_alerts = disabled_alerts;
                    if (r.url.match(/^(https?:\/\/)?\d+\.\d+\.\d+\.\d+[$\/\?:]/)) {
                        add_alert({
                            type: 'ip_url',
                            title: 'IP URL',
                            description: 'The url uses IP and not ' + 'hostname, it will not be served from the' + ' proxy peer. It could mean a resolve ' + 'configuration issue when using SOCKS.'
                        });
                    }
                    if (r.method == 'CONNECT' || request_headers.host == 'lumtest.com' || r.url.match(/^https?:\/\/lumtest.com[$\/\?]/)) {
                        return r;
                    }
                    if (!request_headers['user-agent']) {
                        add_alert({
                            type: 'agent_empty',
                            title: 'Empty user agent',
                            description: 'The User-Agent header ' + 'is not set to any value.'
                        });
                    } else if (!request_headers['user-agent'].match(/^Mozilla\//)) {
                        add_alert({
                            type: 'agent_suspicious',
                            title: 'Suspicious user agent',
                            description: 'The User-Agent header is set to ' + 'a value not corresponding to any of the ' + 'major web browsers.'
                        });
                    }
                    if (!request_headers.accept) {
                        add_alert({
                            type: 'accept_empty',
                            title: 'Empty accept types',
                            description: 'The Accept header is not set to ' + 'any value.'
                        });
                    }
                    if (!request_headers['accept-encoding']) {
                        add_alert({
                            type: 'accept_encoding_empty',
                            title: 'Empty accept encoding',
                            description: 'The Accept-Encoding header is ' + 'not set to any value.'
                        });
                    }
                    if (!request_headers['accept-language']) {
                        add_alert({
                            type: 'accept_language_empty',
                            title: 'Empty accept language',
                            description: 'The Accept-Language header is ' + 'not set to any value.'
                        });
                    }
                    if (request_headers.connection != 'keep-alive') {
                        add_alert({
                            type: 'connection_suspicious',
                            title: 'Suspicious connection type',
                            description: 'The Connection header is not ' + 'set to "keep-alive".'
                        });
                    }
                    if (r.method == 'GET' && !r.url.match(/^https?:\/\/[^\/\?]+\/?$/) && !r.url.match(/[^\w]favicon[^\w]/) && !request_headers.referer) {
                        add_alert({
                            type: 'referer_empty',
                            title: 'Empty referrer',
                            description: 'The Referer header is not set ' + 'even though the requested URL is not ' + 'the home page of the site.'
                        });
                    }
                    var sensitive_headers = [];
                    for (var i in $scope.hola_headers) {
                        if (request_headers[$scope.hola_headers[i]]) sensitive_headers.push($scope.hola_headers[i]);
                    }
                    if (sensitive_headers.length) {
                        add_alert({
                            type: 'sensitive_header',
                            title: 'Sensitive request header',
                            description: (sensitive_headers.length > 1 ? 'There are sensitive request headers' : 'There is sensitive request header') + ' in the request: ' + sensitive_headers.join(', ')
                        });
                    }
                    return r;
                });
            });
        };
        $scope.show_loader = function () {
            return $scope.loading && (0, _date2.default)() - $scope.loading >= loader_delay;
        };
        $scope.sort = function (field) {
            if ($scope.sort_field == field.field) $scope.sort_asc = !$scope.sort_asc;else {
                $scope.sort_field = field.field;
                $scope.sort_asc = true;
            }
            $scope.update();
        };
        $scope.filter = function (field) {
            var options;
            if (field.field == 'method') {
                options = ['', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'COPY', 'HEAD', 'OPTIONS', 'LINK', 'UNLINK', 'PURGE', 'LOCK', 'UNLOCK', 'PROPFIND', 'VIEW', 'TRACE', 'CONNECT'].map(function (e) {
                    return { key: e, value: e };
                });
            } else if (field.field == 'country') options = $scope.$root.consts.proxy.country.values;else if (field.field == 'context') options = $scope.history_context;
            $scope.filter_dialog = [{
                field: field,
                filters: $scope.filters,
                update: $scope.update,
                options: options
            }];
            setTimeout(function () {
                $window.$('#history_filter').one('shown.bs.modal', function () {
                    $window.$('#history_filter .history-filter-autofocus').select().focus();
                }).modal();
            }, 0);
        };
        $scope.filter_cancel = function (field) {
            if (field.field == 'elapsed') {
                $scope.filters.elapsed_min = '';
                $scope.filters.elapsed_max = '';
            }
            if (field.field == 'timestamp') {
                $scope.filters.timestamp_min = null;
                $scope.filters.timestamp_max = null;
            }
            $scope.filters[field.field] = '';
            $scope.update();
        };
        $scope.toggle_prop = function (row, prop) {
            row[prop] = !row[prop];
        };
        $scope.export_type = 'visible';
        $scope.disable_alert = function (row, alert) {
            localStorage.setItem('request-alert-disabled-' + alert.type, 1);
            for (var i = 0; i < row.alerts.length; i++) {
                if (row.alerts[i].type == alert.type) {
                    row.disabled_alerts.push(row.alerts.splice(i, 1)[0]);
                    break;
                }
            }
        };
        $scope.enable_alert = function (row, alert) {
            localStorage.removeItem('request-alert-disabled-' + alert.type);
            for (var i = 0; i < row.disabled_alerts.length; i++) {
                if (row.disabled_alerts[i].type == alert.type) {
                    row.alerts.push(row.disabled_alerts.splice(i, 1)[0]);
                    break;
                }
            }
        };
        $scope.on_period_change = function () {
            var period = $scope.virtual_filters.period;
            if (!period) return;
            if (period != '*') {
                var from = (0, _moment2.default)().subtract($scope.virtual_filters.period).format('YYYY/MM/DD');
                var to = (0, _moment2.default)().format('YYYY/MM/DD');
                $scope.filters.timestamp_min = from;
                $scope.filters.timestamp_max = to;
                $scope.filters.timestamp = from + '-' + to;
            } else {
                $scope.filters.timestamp_min = null;
                $scope.filters.timestamp_max = null;
                $scope.filters.timestamp = '';
            }
            timestamp_changed_by_select = true;
            $scope.update();
        };
        $scope.$watch('filters.timestamp', function (after) {
            if (!after) $scope.virtual_filters.period = '*';else if (!timestamp_changed_by_select) $scope.virtual_filters.period = '';
            timestamp_changed_by_select = false;
        });
        $scope.update();
    };
}

_module.controller('history_filter', History_filter);
History_filter.$inject = ['$scope', '$window'];
function History_filter($scope, $window) {
    $scope.init = function (locals) {
        $scope.field = locals.field;
        var field = locals.field.field;
        var range = field == 'elapsed' || field == 'timestamp';
        $scope.value = { composite: locals.filters[field] };
        if (range) {
            $scope.value.min = locals.filters[field + '_min'];
            $scope.value.max = locals.filters[field + '_max'];
        }
        $scope.options = locals.options;
        $scope.keypress = function (event) {
            if (event.which == 13) {
                $scope.apply();
                $window.$('#history_filter').modal('hide');
            }
        };
        $scope.daterange = function (event) {
            $window.$(event.currentTarget).closest('.input-group').datepicker({
                autoclose: true,
                format: 'yyyy/mm/dd'
            }).datepicker('show');
        };
        $scope.apply = function () {
            if (range) {
                var display_min, display_max;
                display_min = $scope.value.min;
                display_max = $scope.value.max;
                if ($scope.value.min && $scope.value.max) $scope.value.composite = display_min + '-' + display_max;else if ($scope.value.min) $scope.value.composite = 'From ' + display_min;else if ($scope.value.max) $scope.value.composite = 'Up to ' + display_max;else $scope.value.composite = '';
                locals.filters[field + '_min'] = $scope.value.min;
                locals.filters[field + '_max'] = $scope.value.max;
            }
            if ($scope.value.composite != locals.filters[field]) {
                locals.filters[field] = $scope.value.composite;
                locals.update();
            }
        };
    };
}

_module.controller('pool', Pool);
Pool.$inject = ['$scope', '$http', '$window'];
function Pool($scope, $http, $window) {
    $scope.init = function (locals) {
        $scope.port = locals.port;
        $scope.pool_size = locals.pool_size;
        $scope.sticky_ip = locals.sticky_ip;
        $scope.pagination = { page: 1, per_page: 10 };
        $scope.show_modal = function () {
            $window.$('#pool').modal();
        };
        $scope.update = function (refresh) {
            $scope.pool = null;
            $http.get('/api/sessions/' + $scope.port + (refresh ? '?refresh' : '')).then(function (res) {
                $scope.pool = res.data.data;
            });
        };
        $scope.update();
    };
}

_module.controller('proxy', Proxy);
Proxy.$inject = ['$scope', '$http', '$proxies', '$window', '$q', '$www_lum', '$location'];
function Proxy($scope, $http, $proxies, $window, $q, $www_lum, $location) {
    $scope.init = function (locals) {
        var _presets = $www_lum.combine_presets(presets);
        var regions = {};
        var cities = {};
        $scope.consts = $scope.$root.consts.proxy;
        $scope.port = locals.duplicate ? '' : locals.proxy.port;
        var form = $scope.form = _lodash2.default.omit(_lodash2.default.cloneDeep(locals.proxy), 'rules');
        form.port = $scope.port;
        form.zone = form.zone || '';
        form.debug = form.debug || '';
        form.country = form.country || '';
        form.state = form.state || '';
        form.city = form.city || '';
        form.dns = form.dns || '';
        form.log = form.log || '';
        form.ips = form.ips || [];
        form.vips = form.vips || [];
        $scope.presets = _presets;
        if (_lodash2.default.isBoolean(form.rule)) form.rule = {};
        $scope.extra = {
            reverse_lookup: '',
            reverse_lookup_dns: form.reverse_lookup_dns,
            reverse_lookup_file: form.reverse_lookup_file,
            reverse_lookup_values: (form.reverse_lookup_values || []).join('\n')
        };
        $scope.rule_actions = [{ label: 'Retry request(up to 20 times)',
            value: 'retry', raw: { ban_ip: '60min', retry: true } }];
        $scope.rule_statuses = ['200 - Succeeded requests', '403 - Forbidden', '404 - Not found', '500 - Internal server error', '502 - Bad gateway', '503 - Service unavailable', '504 - Gateway timeout', 'Custom'];
        if (form.rule && form.rule.action) {
            form.rule.action = _lodash2.default.find($scope.rule_actions, { value: form.rule.action.value });
        }
        if ($scope.extra.reverse_lookup_dns) $scope.extra.reverse_lookup = 'dns';else if ($scope.extra.reverse_lookup_file) $scope.extra.reverse_lookup = 'file';else if ($scope.extra.reverse_lookup_values) $scope.extra.reverse_lookup = 'values';
        $scope.extra.whitelist_ips = (form.whitelist_ips || []).join(',');
        $scope.status = {};
        var new_proxy = !form.port || form.port == '';
        if (new_proxy) {
            var port = 24000;
            var socks = form.socks;
            $scope.proxies.forEach(function (p) {
                if (p.port >= port) port = p.port + 1;
                if (socks && p.socks == socks) socks++;
            });
            form.port = port;
            form.socks = socks;
        }
        var def_proxy = form;
        if (new_proxy) {
            def_proxy = {};
            for (var key in $scope.consts) {
                if ($scope.consts[key].def !== undefined) def_proxy[key] = $scope.consts[key].def;
            }
        }
        for (var p in _presets) {
            if (_presets[p].check(def_proxy)) {
                form.preset = _presets[p];
                break;
            }
        }
        if (form.last_preset_applied && _presets[form.last_preset_applied]) form.preset = _presets[form.last_preset_applied];
        $scope.apply_preset = function () {
            var last_preset = form.last_preset_applied ? _presets[form.last_preset_applied] : null;
            form.applying_preset = true;
            if (last_preset && last_preset.clean) last_preset.clean(form);
            form.preset.set(form);
            form.last_preset_applied = form.preset.key;
            if (form.session === true) {
                form.session_random = true;
                form.session = '';
            }
            if (form.max_requests) {
                var max_requests = ('' + form.max_requests).split(':');
                form.max_requests_start = +max_requests[0];
                form.max_requests_end = +max_requests[1];
            }
            if (!form.max_requests) form.max_requests_start = 0;
            if (form.session_duration) {
                var session_duration = ('' + form.session_duration).split(':');
                form.duration_start = +session_duration[0];
                form.duration_end = +session_duration[1];
            }
            delete form.applying_preset;
        };
        $scope.apply_preset();
        $scope.form_errors = {};
        $scope.defaults = {};
        $http.get('/api/defaults').then(function (defaults) {
            $scope.defaults = defaults.data;
        });
        $scope.regions = [];
        $scope.cities = [];
        $scope.beta_features = $scope.$root.beta_features;
        $scope.get_zones_names = function () {
            return Object.keys($scope.zones);
        };
        $scope.show_modal = function () {
            $window.$('#proxy').one('shown.bs.modal', function () {
                $window.$('#proxy-field-port').select().focus();
                $window.$('#proxy .panel-collapse').on('show.bs.collapse', function (event) {
                    var container = $window.$('#proxy .proxies-settings');
                    var opening = $window.$(event.currentTarget).closest('.panel');
                    var pre = opening.prevAll('.panel');
                    var top;
                    if (pre.length) {
                        top = opening.position().top + container.scrollTop();
                        var closing = pre.find('.panel-collapse.in');
                        if (closing.length) top -= closing.height();
                    } else top = 0;
                    container.animate({ 'scrollTop': top }, 250);
                });
            }).modal();
        };
        $scope.is_show_allocated_ips = function () {
            var zone = $scope.consts.zone.values.filter(function (z) {
                return z.value == form.zone;
            })[0];
            var plan = (zone && zone.plans || []).slice(-1)[0];
            return (plan && plan.type || zone && zone.type) == 'static';
        };
        $scope.show_allocated_ips = function () {
            var zone = form.zone;
            var keypass = form.password || '';
            var modals = $scope.$root;
            modals.allocated_ips = {
                ips: [],
                loading: true,
                random_ip: function random_ip() {
                    modals.allocated_ips.ips.forEach(function (item) {
                        item.checked = false;
                    });
                    form.ips = [];
                    form.pool_size = 0;
                },
                toggle_ip: function toggle_ip(item) {
                    var index = form.ips.indexOf(item.ip);
                    if (item.checked && index < 0) form.ips.push(item.ip);else if (!item.checked && index > -1) form.ips.splice(index, 1);
                    form.pool_size = form.ips.length;
                },
                zone: zone
            };
            $window.$('#allocated_ips').modal();
            $http.get('/api/allocated_ips?zone=' + zone + '&key=' + keypass).then(function (res) {
                form.ips = form.ips.filter(function (ip) {
                    return res.data.ips.includes(ip);
                });
                modals.allocated_ips.ips = res.data.ips.map(function (ip_port) {
                    var ip = ip_port.split(':')[0];
                    return { ip: ip, checked: form.ips.includes(ip) };
                });
                modals.allocated_ips.loading = false;
            });
        };
        $scope.is_show_allocated_vips = function () {
            var zone = $scope.consts.zone.values.filter(function (z) {
                return z.value == form.zone;
            })[0];
            var plan = (zone && zone.plans || []).slice(-1)[0];
            return plan && !!plan.vip;
        };
        $scope.show_allocated_vips = function () {
            var zone = form.zone;
            var keypass = form.password || '';
            var modals = $scope.$root;
            modals.allocated_vips = {
                vips: [],
                loading: true,
                random_vip: function random_vip() {
                    modals.allocated_vips.vips.forEach(function (item) {
                        item.checked = false;
                    });
                    form.vips = [];
                    form.pool_size = 0;
                },
                toggle_vip: function toggle_vip(item) {
                    var index = form.vips.indexOf(item.vip);
                    if (item.checked && index < 0) form.vips.push(item.vip);else if (!item.checked && index > -1) form.vips.splice(index, 1);
                    form.pool_size = form.vips.length;
                },
                zone: zone
            };
            $window.$('#allocated_vips').modal();
            $http.get('/api/allocated_vips?zone=' + zone + '&key=' + keypass).then(function (res) {
                form.vips = form.vips.filter(function (vip) {
                    return res.data.includes(vip);
                });
                modals.allocated_vips.vips = res.data.map(function (vip) {
                    return { vip: vip, checked: form.vips.includes(vip) };
                });
                modals.allocated_vips.loading = false;
            });
        };
        $scope.binary_changed = function (proxy, field, value) {
            proxy[field] = { 'yes': true, 'no': false, 'default': '' }[value];
        };
        var update_allowed_countries = function update_allowed_countries() {
            var countries = $scope.consts.country.values;
            $scope.allowed_countries = [];
            if (!countries) return;
            if (form.zone != 'static') return $scope.allowed_countries = countries;
            $scope.allowed_countries = countries.filter(function (c) {
                return ['', 'au', 'br', 'de', 'gb', 'us'].includes(c.value);
            });
        };
        $scope.update_regions_and_cities = function (is_init) {
            if (!is_init) $scope.form.region = $scope.form.city = '';
            $scope.regions = [];
            $scope.cities = [];
            var country = ($scope.form.country || '').toUpperCase();
            if (!country || country == '*') return;
            if (regions[country]) $scope.regions = regions[country];else {
                regions[country] = [];
                $http.get('/api/regions/' + country).then(function (res) {
                    $scope.regions = regions[country] = res.data;
                });
            }
            if (cities[country]) $scope.cities = cities[country];else {
                cities[country] = [];
                $http.get('/api/cities/' + country).then(function (res) {
                    cities[country] = res.data.map(function (city) {
                        if (city.region) city.value = city.value + ' (' + city.region + ')';
                        return city;
                    });
                    $scope.cities = cities[country];
                    $scope.update_cities();
                });
            }
        };
        $scope.update_cities = function () {
            var country = $scope.form.country.toUpperCase();
            var state = $scope.form.state;
            if (state == '' || state == '*') {
                $scope.form.city = '';
                $scope.cities = cities[country];
            } else {
                $scope.cities = cities[country].filter(function (item) {
                    return !item.region || item.region == state;
                });
                var exist = $scope.cities.filter(function (item) {
                    return item.key == $scope.form.city;
                }).length > 0;
                if (!exist) $scope.form.city = '';
            }
        };
        $scope.update_region_by_city = function (city) {
            if (city.region) $scope.form.state = city.region;
            $scope.update_cities();
        };
        $scope.reset_rules = function () {
            $scope.form.rule = {};
            $scope.form.rules = {};
            $scope.form.delete_rules = true;
            ga_event('proxy_form', 'reset_rules');
        };
        $scope.$watch('form.zone', function (val, old) {
            if (!$scope.consts || val == old) return;
            update_allowed_countries();
            var zone;
            if (zone = $scope.consts.zone.values.find(_lodash2.default.matches({ zone: val }))) form.password = zone.password;
        });
        $scope.$watchCollection('form', function (newv, oldv) {
            function has_changed(f) {
                var old = oldv && oldv[f] || '';
                var val = newv && newv[f] || '';
                return old !== val;
            }
            if (has_changed('preset')) {
                return ga_event('proxy_form', 'preset_change', newv.preset.title);
            }
            if (newv.applying_preset) return;
            for (var f in _lodash2.default.extend({}, newv, oldv)) {
                if (has_changed(f) && f != 'applying_preset' && f != 'rule') {
                    ga_event('proxy_form', f + '_change', f == 'password' ? 'redacted' : newv[f]);
                }
            }
        });
        $scope.$watchCollection('form.rule', function (newv, oldv) {
            function has_changed(f) {
                var old = oldv && oldv[f] || '';
                var val = newv && newv[f] || '';
                old = (typeof old === 'undefined' ? 'undefined' : _typeof(old)) == 'object' ? old.value : old;
                val = (typeof val === 'undefined' ? 'undefined' : _typeof(val)) == 'object' ? val.value : val;
                return old !== val;
            }
            if (_lodash2.default.isEmpty($scope.form.rule)) return;
            var val;
            for (var f in _lodash2.default.extend({}, newv, oldv)) {
                if (!has_changed(f)) continue;
                val = _typeof(newv[f]) == 'object' ? newv[f].value : newv[f];
                ga_event('proxy_form', 'rule_' + f + '_change', val);
            }
        });
        $scope.save = function (model) {
            var proxy = _angular2.default.copy(model);
            delete proxy.preset;
            for (var field in proxy) {
                if (!$scope.is_valid_field(field) || proxy[field] === null) proxy[field] = '';
            }
            var make_int_range = function make_int_range(start, end) {
                var s = parseInt(start, 10) || 0;
                var e = parseInt(end, 10) || 0;
                return s && e ? [s, e].join(':') : s || e;
            };
            var effective = function effective(prop) {
                return proxy[prop] === undefined ? $scope.defaults[prop] : proxy[prop];
            };
            if (proxy.session_random) proxy.session = true;
            proxy.max_requests = make_int_range(proxy.max_requests_start, proxy.max_requests_end);
            delete proxy.max_requests_start;
            delete proxy.max_requests_end;
            proxy.session_duration = make_int_range(proxy.duration_start, proxy.duration_end);
            delete proxy.duration_start;
            delete proxy.duration_end;
            proxy.history = effective('history');
            proxy.ssl = effective('ssl');
            proxy.max_requests = effective('max_requests');
            proxy.session_duration = effective('session_duration');
            proxy.keep_alive = effective('keep_alive');
            proxy.pool_size = effective('pool_size');
            proxy.proxy_type = 'persist';
            proxy.reverse_lookup_dns = '';
            proxy.reverse_lookup_file = '';
            proxy.reverse_lookup_values = '';
            if ($scope.extra.reverse_lookup == 'dns') proxy.reverse_lookup_dns = true;
            if ($scope.extra.reverse_lookup == 'file') proxy.reverse_lookup_file = $scope.extra.reverse_lookup_file;
            if ($scope.extra.reverse_lookup == 'values') {
                proxy.reverse_lookup_values = $scope.extra.reverse_lookup_values.split('\n');
            }
            proxy.whitelist_ips = $scope.extra.whitelist_ips.split(',').filter(Boolean);
            var reload;
            if (Object.keys(proxy.rule || {}).length) {
                if (!proxy.rule.url) delete proxy.rule.url;
                proxy.rule = _lodash2.default.extend({
                    url: '**',
                    action: {}
                }, proxy.rule);
                var rule_status = proxy.rule.status == 'Custom' ? proxy.rule.custom : proxy.rule.status;
                proxy.rules = {
                    post: [{
                        res: [{
                            head: true,
                            status: {
                                type: 'in',
                                arg: rule_status || ''
                            },
                            action: proxy.rule.action.raw || {}
                        }],
                        url: proxy.rule.url + '/**'
                    }]
                };
                reload = true;
            } else delete proxy.rules;
            if (proxy.delete_rules) proxy.rules = {};
            delete proxy.delete_rules;
            model.preset.set(proxy);
            var edit = $scope.port && !locals.duplicate;
            ga_event('proxy_form', 'proxy_' + (edit ? 'edit' : 'create'), 'start');
            var save_inner = function save_inner() {
                $scope.status.type = 'warning';
                $scope.status.message = 'Saving the proxy...';
                var promise = edit ? $http.put('/api/proxies/' + $scope.port, { proxy: proxy }) : $http.post('/api/proxies/', { proxy: proxy });
                var is_ok_cb = function is_ok_cb() {
                    $window.$('#proxy').modal('hide');
                    $proxies.update();
                    var curr_step = JSON.parse($window.localStorage.getItem('quickstart-step'));
                    if (curr_step == _common.onboarding_steps.ADD_PROXY) {
                        $window.localStorage.setItem('quickstart-step', _common.onboarding_steps.ADD_PROXY_DONE);
                        $window.localStorage.setItem('quickstart-first-proxy', proxy.port);
                    }
                    ga_event('proxy_form', 'proxy_' + (edit ? 'edit' : 'create'), 'ok');
                    return $http.post('/api/recheck').then(function (r) {
                        if (qs_o.action && qs_o.action == 'tutorial_add_proxy') {
                            $location.search({});
                            ga_event('lpm-onboarding', '04 tutorial create port completed', '');
                            $window.location = '/intro';
                        }
                        if (r.data.login_failure) $window.location = '/';
                    });
                };
                var is_not_ok_cb = function is_not_ok_cb(res) {
                    $scope.status.type = 'danger';
                    $scope.status.message = 'Error: ' + res.data.status;
                    ga_event('proxy_form', 'proxy_' + (edit ? 'edit' : 'create'), 'err');
                };
                promise.then(function () {
                    if (reload) {
                        $scope.status.type = 'warning';
                        $scope.status.message = 'Loading...';
                        return setTimeout(function () {
                            $window.location.reload();
                        }, 800);
                    }
                    $scope.status.type = 'warning';
                    $scope.status.message = 'Checking the proxy...';
                    return $http.get('/api/proxy_status/' + proxy.port);
                }).then(function (res) {
                    if (res.data.status == 'ok') return is_ok_cb(res);
                    return is_not_ok_cb(res);
                });
            };
            var url = '/api/proxy_check' + (edit ? '/' + $scope.port : '');
            $http.post(url, proxy).then(function (res) {
                $scope.form_errors = {};
                var warnings = [];
                _angular2.default.forEach(res.data, function (item) {
                    if (item.lvl == 'err') {
                        var msg = item.msg;
                        if (item.field == 'password' && msg == 'the provided password is not valid') {
                            msg = 'Wrong password';
                        }
                        $scope.form_errors[item.field] = msg;
                    }
                    if (item.lvl == 'warn') warnings.push(item.msg);
                });
                if (Object.keys($scope.form_errors).length) return;else if (warnings.length) {
                    $scope.$root.confirmation = {
                        text: 'Warning' + (warnings.length > 1 ? 's' : '') + ':',
                        items: warnings,
                        confirmed: save_inner
                    };
                    return $window.$('#confirmation').modal();
                }
                save_inner();
            });
        };
        $scope.is_valid_field = function (name) {
            return is_valid_field($scope.form, name, $scope.consts.zone);
        };
        $scope.starts_with = function (actual, expected) {
            return actual.toLowerCase().startsWith(expected.toLowerCase());
        };
        $scope.update_regions_and_cities(true);
        update_allowed_countries();
    };
}

_module.controller('columns', Columns);
Columns.$inject = ['$scope', '$window'];
function Columns($scope, $window) {
    $scope.init = function (locals) {
        $scope.columns = locals.columns;
        $scope.form = _lodash2.default.cloneDeep(locals.cols_conf);
        $scope.show_modal = function () {
            $window.$('#proxy-cols').modal();
        };
        $scope.save = function (config) {
            $window.$('#proxy-cols').modal('hide');
            $window.localStorage.setItem('columns', JSON.stringify(config));
            for (var c in config) {
                locals.cols_conf[c] = config[c];
            }
        };
        $scope.all = function () {
            for (var c in $scope.columns) {
                $scope.form[$scope.columns[c].key] = true;
            }
        };
        $scope.none = function () {
            for (var c in $scope.columns) {
                $scope.form[$scope.columns[c].key] = false;
            }
        };
        $scope.default = function () {
            for (var c in $scope.columns) {
                $scope.form[$scope.columns[c].key] = locals.default_cols[$scope.columns[c].key];
            }
        };
    };
}

_module.filter('timestamp', timestamp_filter);
function timestamp_filter() {
    return function (timestamp) {
        return (0, _moment2.default)(timestamp).format('YYYY/MM/DD HH:mm');
    };
}

_module.filter('requests', requests_filter);
requests_filter.$inject = ['$filter'];
function requests_filter($filter) {
    var number_filter = $filter('number');
    return function (requests, precision) {
        if (!requests || isNaN(parseFloat(requests)) || !isFinite(requests)) {
            return '';
        }
        if (typeof precision === 'undefined') precision = 0;
        return number_filter(requests, precision);
    };
}

_module.filter('bytes', function () {
    return _util2.default.bytes_format;
});

_module.filter('request', request_filter);
function request_filter() {
    return function (r) {
        return '/tools?test=' + encodeURIComponent(JSON.stringify({
            port: r.port,
            url: r.url,
            method: r.method,
            body: r.request_body,
            headers: r.request_headers
        }));
    };
}

_module.directive('initInputSelect', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            setTimeout(function () {
                element.select().focus();
            }, 100); // before changing check for input type=number in Firefox
        }
    };
}]);

_module.directive('initSelectOpen', ['$window', function ($window) {
    return {
        restrict: 'A',
        link: function link(scope, element, attrs) {
            setTimeout(function () {
                element.focus();
            }, 100);
        }
    };
}]);

_module.directive('reactView', ['$state', function ($state) {
    return {
        scope: { view: '=reactView', props: '@stateProps',
            extra_props: '=extraProps' },
        link: function link(scope, element, attrs) {
            var props = _lodash2.default.pick($state.params, (scope.props || '').split(' '));
            Object.assign(props, { extra: scope.extra_props });
            _reactDom2.default.render(_react2.default.createElement(scope.view, props), element[0]);
            element.on('$destroy', function () {
                _reactDom2.default.unmountComponentAtNode(element[0]);
            });
        }
    };
}]);

_module.filter('shorten', shorten_filter);
shorten_filter.$inject = ['$filter'];
function shorten_filter($filter) {
    return function (s, chars) {
        if (s.length <= chars + 2) return s;
        return s.substr(0, chars) + '...';
    };
}

_angular2.default.bootstrap(document, ['app']);

/***/ }),

/***/ 373:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON
'use strict'; /*jslint node:true, browser:true*/
(function(){

var is_node = typeof module=='object' && module.exports && module.children;
if (!is_node)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = {};
var assign = Object.assign;

// Returns an array of arrays:
// [['field1', 'field2', 'field3'], ['1','2','3'], [..], ..]
E.to_arr = function(data, opt){
    opt = assign({field: ',', quote: '"', line: '\n'}, opt);
    var line = opt.line, field = opt.field, quote = opt.quote;
    var i = 0, c = data[i], row = 0, array = [];
    while (c)
    {
        while (opt.trim && (c==' ' || c=='\t' || c=='\r'))
            c = data[++i];
        var value = '';
        if (c==quote)
        {
            // value enclosed by quote
            c = data[++i];
            do {
                if (c!=quote)
                {
                    // read a regular character and go to the next character
                    value += c;
                    c = data[++i];
                }
                if (c==quote)
                {
                    // check for escaped quote
                    if (data[i+1]==quote)
                    {
                        // this is an escaped field. Add a quote
                        // to the value, and move two characters ahead.
                        value += quote;
                        i += 2;
                        c = data[i];
                    }
                }
            } while (c && (c!=quote || data[i+1]==quote));
            if (!c)
                throw 'Unexpected end of data, no closing quote found';
            c = data[++i];
        }
        else
        {
            // value not escaped with quote
            while (c && c!=field && c!=line &&
                (!opt.trim || c!=' ' && c!='\t' && c!='\r'))
            {
                value += c;
                c = data[++i];
            }
        }
        // add the value to the array
        if (array.length<=row)
            array.push([]);
        array[row].push(value);
        // skip whitespaces
        while (opt.trim && (c==' ' || c=='\t' || c=='\r'))
            c = data[++i];
        // go to the next row or column
        if (c==field);
        else if (c==line)
            row++;
        else if (c)
            throw 'Delimiter expected after character '+i;
        c = data[++i];
    }
    if (i && data[i-1]==field)
        array[row].push('');
    return array;
};

// Returns an array of hashs:
// [{field1: '1', field2: '2', field3: '3'}, {..}, ..]
E.to_obj = function(data, opt){
    var arr = E.to_arr(data, opt);
    if (!arr.length)
        return arr;
    var i, result = [], headers = arr[0];
    if ((i = headers.indexOf(''))!=-1)
        throw new Error('Field '+i+' has unknown name');
    for (i=1; i<arr.length; i++)
    {
        var obj = {};
        if (arr[i].length > headers.length)
            throw new Error('Line '+i+' has more fields than header');
        for (var j=0; j<arr[i].length; j++)
            obj[headers[j]] = arr[i][j];
        result.push(obj);
    }
    return result;
};

E.escape_field = function(s, opt){
    // opt not fully supported
    if (s==null && opt && opt.null_to_empty)
        return '';
    s = ''+s;
    if (!/["'\n,]/.test(s))
	return s;
    return '"'+s.replace(/"/g, '""')+'"';
};

E.to_str = function(csv, opt){
    var s = '', i, j, a;
    opt = assign({field: ',', quote: '"', line: '\n'}, opt);
    var line = opt.line, field = opt.field;
    function line_to_str(vals){
        var s = '';
        for (var i=0; i<vals.length; i++)
            s += (i ? field : '')+E.escape_field(vals[i], opt);
        return s+line;
    }
    if (!csv.length && !opt.keys)
        return '';
    if (Array.isArray(csv[0]))
    {
        if (opt.keys)
            s += line_to_str(opt.keys);
        for (i=0; i<csv.length; i++)
            s += line_to_str(csv[i]);
        return s;
    }
    var keys = opt.keys || Object.keys(csv[0]);
    if (opt.print_keys===undefined || opt.print_keys)
        s += line_to_str(keys);
    for (i=0; i<csv.length; i++)
    {
        for (j=0, a=[]; j<keys.length; j++)
        {
            var v = csv[i][keys[j]];
            a.push(v===undefined ? '' : v);
        }
        s += line_to_str(a);
    }
    return s;
};

E.to_blob = function(csv, opt){
    return new Blob([E.to_str(csv, opt)], {type: 'application/csv'}); };

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 374:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){

var is_node = typeof module=='object' && module.exports && module.children;
var is_ff_addon = typeof module=='object' && module.uri
    && !module.uri.indexOf('resource://');
var qs;
if (!is_node && !is_ff_addon)
    ;
else
{
    ;
    qs = require(is_ff_addon ? 'sdk/querystring' : 'querystring');
}
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var assign = Object.assign;
var E = {};

E.add_proto = function(url){
    if (!url.match(/^([a-z0-9]+:)?\/\//i))
	url = 'http://'+url;
    return url;
};

E.rel_proto_to_abs = function(url){
    var proto = is_node ? 'http:' : location.protocol;
    return url.replace(/^\/\//, proto+'//');
};

E.get_top_level_domain = function(host){
    var n = host.match(/\.([^.]+)$/);
    return n ? n[1] : '';
};

E.get_host = function(url){
    var n = url.match(/^(https?:)?\/\/([^\/]+)\/.*$/);
    return n ? n[2] : '';
};

E.get_host_without_tld = function(host){
    return host.replace(/^([^.]+)\.[^.]{2,3}(\.[^.]{2,3})?$/, '$1');
};

E.get_path = function(url){
    var n = url.match(/^https?:\/\/[^\/]+(\/.*$)/);
    return n ? n[1] : '';
};

E.get_proto = function(url){
    var n = url.match(/^([a-z0-9]+):\/\//);
    return n ? n[1] : '';
};

E.get_host_gently = function(url){
    var n = url.match(/^(?:(?:[a-z0-9]+?:)?\/\/)?([^\/]+)/);
    return n ? n[1] : '';
};

E.is_ip = function(host){
    var m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
    if (!m)
        return false;
    for (var i=1; i<=4; i++)
    {
        if (+m[i]>255)
            return false;
    }
    return true;
};

E.is_ip_mask = function(host){
    var m = /^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/.exec(host);
    if (!m)
        return false;
    if (E.ip2num(host)==0)
        return false;
    var final = false;
    var check_num_mask = function(num){
        var arr = (num >>> 0).toString(2).split(''), final = false;
        for (var i=0; i<arr.length; i++)
        {
            if (final && arr[i]=='1')
                return false;
            if (!final && arr[i]=='0')
                final = true;
        }
        return true;
    };
    for (var i=1; i<=4; i++)
    {
        if (+m[i]>255)
            return false;
        if (final && +m[i]>0)
            return false;
        if (!final && +m[i]<255)
        {
            if (!check_num_mask(+m[i]))
                return false;
            final = true;
        }
    }
    return !!final;
};

E.ip2num = function(ip){
    var num = 0;
    ip.split('.').forEach(function(octet){
        num <<= 8;
        num += +octet;
    });
    return num>>>0;
};

E.num2ip = function(num){
    return (num>>>24)+'.'+(num>>16 & 255)+'.'+(num>>8 & 255)+'.'+(num & 255);
};

E.is_ip_subnet = function(host){
    var m = /(.+?)\/(\d+)$/.exec(host);
    return m && E.is_ip(m[1]) && +m[2]<=32;
};

E.is_ip_netmask = function(host){
    var ips = host.split('/');
    if (ips.length!=2 || !E.is_ip(ips[0]) || !E.is_ip_mask(ips[1]))
        return false;
    return true;
};

E.is_ip_range = function(host){
    var ips = host.split('-');
    if (ips.length!=2 || !E.is_ip(ips[0]) || !E.is_ip(ips[1]))
        return false;
    return E.ip2num(ips[0])<E.ip2num(ips[1]);
};

E.is_ip_port = function(host){
    var m = /(.+?)(?::(\d{1,5}))?$/.exec(host);
    return m && E.is_ip(m[1]) && !(+m[2]>65535);
};

/* basic url validation to prevent script injection like 'javascript:....' */
E.is_valid_url = function(url){
    return /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z0-9-]+(\/.*)?$/i.test(url); };

E.is_valid_domain = function(domain){
    return /^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,63}$/.test(domain); };

E.is_hola_domain = function(domain){
    return domain.search(/^(.*\.)?(hola\.org|holacdn\.com|h-cdn\.com)$/)!=-1;
};

E.is_valid_email = function(email){
    var n = email.toLowerCase().match(/^[a-z0-9_\.\-\+]+@(.*)$/);
    return !!(n && E.is_valid_domain(n[1]));
};

E.is_ip_in_range = function(ips_range, ip){
    if (!E.is_ip_range(ips_range) || !E.is_ip(ip))
        return false;
    var ips = ips_range.split('-');
    var min_ip = E.ip2num(ips[0]), max_ip = E.ip2num(ips[1]);
    var num_ip = E.ip2num(ip);
    return num_ip>=min_ip && num_ip<=max_ip;
};

E.host_lookup = function(lookup, host){
    var pos;
    while (1)
    {
        if (host in lookup)
            return lookup[host];
        if ((pos = host.indexOf('.'))<0)
            return;
        host = host.slice(pos+1);
    }
};

// more-or-less compatible with NodeJS url API
E.uri_obj_href = function(uri){
    return (uri.protocol||'')+(uri.slashes ? '//' : '')
        +(uri.host ? (uri.auth ? uri.auth+'@' : '')+uri.host : '')
        +uri.path
        +(uri.hash||'');
};

var protocol_re = /^((?:about|http|https|file|ftp|ws|wss):)?(\/\/)?/i;
var host_section_re = /^(.*?)(?:[\/?#]|$)/;
var host_re = /^(?:(([^:@]*):?([^:@]*))?@)?([^:]*)(?::(\d*))?/;
var path_section_re = /^([^?#]*)(\?[^#]*)?(#.*)?$/;
var path_re_loose = /^(\/(?:.(?![^\/]*\.[^\/.]+$))*\/?)?([^\/]*?(?:\.([^.]+))?)$/;
var path_re_strict = /^(\/(?:.(?![^\/]*(?:\.[^\/.]+)?$))*\/?)?([^\/]*?(?:\.([^.]+))?)$/;

E.parse = function(url, strict){
    function re(expr, str){
        var m;
        try { m = expr.exec(str); } catch(e){ m = null; }
        if (!m)
            return m;
        for (var i=0; i<m.length; i++)
            m[i] = m[i]===undefined ? null : m[i];
        return m;
    }
    url = url||location.href;
    var m, uri = {orig: url}, remaining = url;
    // protocol
    if (!(m = re(protocol_re, remaining)))
        return {};
    uri.protocol = m[1];
    if (uri.protocol!==null)
        uri.protocol = uri.protocol.toLowerCase();
    uri.slashes = !!m[2];
    if (!uri.protocol && !uri.slashes)
    {
        uri.protocol = 'http:';
        uri.slashes = true;
    }
    remaining = remaining.slice(m[0].length);
    // host
    if (!(m = re(host_section_re, remaining)))
        return {};
    uri.authority = m[1];
    remaining = remaining.slice(m[1].length);
    // host elements
    if (!(m = re(host_re, uri.authority)))
        return {};
    uri.auth = m[1];
    uri.user = m[2];
    uri.password = m[3];
    uri.hostname = m[4];
    uri.port = m[5];
    if (uri.hostname!==null)
    {
        uri.hostname = uri.hostname.toLowerCase();
        uri.host = uri.hostname+(uri.port ? ':'+uri.port : '');
    }
    // path
    if (!(m = re(path_section_re, remaining)))
        return {};
    uri.relative = m[0];
    uri.pathname = m[1];
    uri.search = m[2];
    uri.query = uri.search ? uri.search.substring(1) : null;
    uri.hash = m[3];
    // path elements
    if (!(m = re(strict ? path_re_strict : path_re_loose, uri.pathname)))
        return {};
    uri.directory = m[1];
    uri.file = m[2];
    uri.ext = m[3];
    if (uri.file=='.'+uri.ext)
        uri.ext = null;
    // finals
    if (!uri.pathname)
        uri.pathname = '/';
    uri.path = uri.pathname+(uri.search||'');
    uri.href = E.uri_obj_href(uri);
    return uri;
};

E.qs_parse = function(q, bin){
    var obj = {};
    q = q.split('&');
    var len = q.length;
    var unescape_val = bin ? function(val){
        return qs.unescapeBuffer(val, true).toString('binary');
    } : function(val){
        return decodeURIComponent(val.replace(/\+/g, ' '));
    };
    for (var i = 0; i<len; ++i)
    {
	var x = q[i];
	var idx = x.indexOf('=');
	var kstr = idx>=0 ? x.substr(0, idx) : x;
	var vstr = idx>=0 ? x.substr(idx + 1) : '';
        var k = unescape_val(kstr);
        var v = unescape_val(vstr);
	if (obj[k]===undefined)
	    obj[k] = v;
	else if (Array.isArray(obj[k]))
	    obj[k].push(v);
	else
	    obj[k] = [obj[k], v];
    }
    return obj;
};

function token_regex(s, end){ return end ? '^'+s+'$' : s; }

E.http_glob_host = function(host, end){
    var port = '';
    var parts = host.split(':');
    host = parts[0];
    if (parts.length>1)
        port = ':'+parts[1].replace('*', '[0-9]+');
    var n = host.match(/^(|.*[^*])(\*+)$/);
    if (n)
    {
        host = E.http_glob_host(n[1])
        +(n[2].length==1 ? '[^./]+' : '[^/]'+(n[1] ? '*' : '+'));
        return token_regex(host+port, end);
    }
    /* '**' replace doesn't use '*' in output to avoid conflict with '*'
     * replace following it */
    host = host.replace(/\*\*\./, '**').replace(/\*\./, '*')
    .replace(/\./g, '\\.').replace(/\*\*/g, '(([^./]+\\.)+)?')
    .replace(/\*/g, '[^./]+\\.');
    return token_regex(host+port, end);
};

E.http_glob_path = function(path, end){
    if (path[0]=='*')
	return E.http_glob_path('/'+path, end);
    var n = path.match(/^(|.*[^*])(\*+)([^*^\/]*)$/);
    if (n)
    {
	path = E.http_glob_path(n[1])+(n[2].length==1 ? '[^/]+' : '.*')+
	    E.http_glob_path(n[3]);
	return token_regex(path, end);
    }
    path = path.replace(/\*\*\//, '**').replace(/\*\//, '*')
    .replace(/\//g, '\\/').replace(/\./g, '\\.')
    .replace(/\*\*/g, '(([^/]+\\/)+)?').replace(/\*/g, '[^/]+\\/');
    return token_regex(path, end);
};

E.http_glob_url = function(url, end){
    var n = url.match(/^((.*):\/\/)?([^\/]+)(\/.*)?$/);
    if (!n)
	return null;
    var prot = n[1] ? n[2] : '*';
    var host = n[3];
    var path = n[4]||'**';
    if (prot=='*')
	prot = 'https?';
    host = E.http_glob_host(host);
    path = E.http_glob_path(path);
    return token_regex(prot+':\\/\\/'+host+path, end);
};

E.root_url_cmp = function(a, b){
    var a_s = a.match(/^[*.]*([^*]+)$/);
    var b_s = b.match(/^[*.]*([^*]+)$/);
    if (!a_s && !b_s)
	return false;
    var re, s;
    if (a_s && b_s && a_s[1].length>b_s[1].length || a_s && !b_s)
    {
	s = a_s[1];
	re = b;
    }
    else
    {
	s = b_s[1];
	re = a;
    }
    s = E.add_proto(s)+'/';
    if (!(re = E.http_glob_url(re, 1)))
	return false;
    try { re = new RegExp(re); }
    catch(e){ return false; }
    return re.test(s);
};

E.qs_strip = function(url){ return /^[^?#]*/.exec(url)[0]; };

// mini-implementation of zescape.qs to avoid dependency of escape.js
function qs_str(qs){
    var q = [];
    for (var k in qs)
    {
        (Array.isArray(qs[k]) ? qs[k] : [qs[k]]).forEach(function(v){
            q.push(encodeURIComponent(k)+'='+encodeURIComponent(v)); });
    }
    return q.join('&');
}

E.qs_add = function(url, qs){
    var u = E.parse(url), q = assign(u.query ? E.qs_parse(u.query) : {}, qs);
    u.path = u.pathname+'?'+qs_str(q);
    return E.uri_obj_href(u);
};

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 375:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _date = __webpack_require__(105);

var _date2 = _interopRequireDefault(_date);

var _axios = __webpack_require__(182);

var _axios2 = _interopRequireDefault(_axios);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

var _status_codes = __webpack_require__(98);

var _domains = __webpack_require__(128);

var _protocols = __webpack_require__(129);

var _common3 = __webpack_require__(64);

__webpack_require__(295);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('stats', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var StatRow = function (_React$Component) {
    _inherits(StatRow, _React$Component);

    function StatRow(props) {
        _classCallCheck(this, StatRow);

        var _this2 = _possibleConstructorReturn(this, (StatRow.__proto__ || Object.getPrototypeOf(StatRow)).call(this, props));

        _this2.state = {};
        return _this2;
    }

    _createClass(StatRow, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            var _this3 = this;

            _lodash2.default.each(props.stat, function (v, k) {
                if (!_this3.state['class_' + k] && _this3.props.stat[k] != v) {
                    _this3.setState(_defineProperty({}, 'class_' + k, 'stats_row_change'));
                    setTimeout(function () {
                        return _this3.setState(_defineProperty({}, 'class_' + k, undefined));
                    }, 1000);
                }
            });
        }
    }]);

    return StatRow;
}(_react2.default.Component);

var SRow = function (_StatRow) {
    _inherits(SRow, _StatRow);

    function SRow() {
        _classCallCheck(this, SRow);

        return _possibleConstructorReturn(this, (SRow.__proto__ || Object.getPrototypeOf(SRow)).apply(this, arguments));
    }

    _createClass(SRow, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_status_codes.StatusCodeRow, _extends({ class_value: this.state.class_value,
                class_bw: this.state.class_bw }, this.props));
        }
    }]);

    return SRow;
}(StatRow);

var DRow = function (_StatRow2) {
    _inherits(DRow, _StatRow2);

    function DRow() {
        _classCallCheck(this, DRow);

        return _possibleConstructorReturn(this, (DRow.__proto__ || Object.getPrototypeOf(DRow)).apply(this, arguments));
    }

    _createClass(DRow, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_domains.DomainRow, _extends({ class_value: this.state.class_value,
                class_bw: this.state.class_bw }, this.props));
        }
    }]);

    return DRow;
}(StatRow);

var PRow = function (_StatRow3) {
    _inherits(PRow, _StatRow3);

    function PRow() {
        _classCallCheck(this, PRow);

        return _possibleConstructorReturn(this, (PRow.__proto__ || Object.getPrototypeOf(PRow)).apply(this, arguments));
    }

    _createClass(PRow, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(_protocols.ProtocolRow, _extends({ class_value: this.state.class_value,
                class_bw: this.state.class_bw }, this.props));
        }
    }]);

    return PRow;
}(StatRow);

var StatTable = function (_React$Component2) {
    _inherits(StatTable, _React$Component2);

    function StatTable() {
        var _ref;

        var _temp, _this7, _ret;

        _classCallCheck(this, StatTable);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this7 = _possibleConstructorReturn(this, (_ref = StatTable.__proto__ || Object.getPrototypeOf(StatTable)).call.apply(_ref, [this].concat(args))), _this7), _this7.enter = function () {
            var dt = _this7.props.dataType;
            E.sp.spawn(_this7.sp = (0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _etask2.default.sleep(2 * _date2.default.ms.SEC);

                            case 2:
                                _util2.default.ga_event('stats panel', 'hover', dt);

                            case 3:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }, _this7.leave = function () {
            if (_this7.sp) _this7.sp.return();
        }, _temp), _possibleConstructorReturn(_this7, _ret);
    }

    _createClass(StatTable, [{
        key: 'render',
        value: function render() {
            var Table = this.props.table || _common2.default.StatTable;
            return _react2.default.createElement(
                'div',
                { onMouseEnter: this.enter, onMouseLeave: this.leave },
                _react2.default.createElement(Table, _extends({ go: true }, this.props))
            );
        }
    }]);

    return StatTable;
}(_react2.default.Component);

var SuccessRatio = function (_React$Component3) {
    _inherits(SuccessRatio, _React$Component3);

    function SuccessRatio(props) {
        _classCallCheck(this, SuccessRatio);

        var _this8 = _possibleConstructorReturn(this, (SuccessRatio.__proto__ || Object.getPrototypeOf(SuccessRatio)).call(this, props));

        _this8.state = { total: 0, success: 0 };
        _this8.get_req_status_stats = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee2(_this) {
            var res;
            return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
                while (1) {
                    switch (_context2.prev = _context2.next) {
                        case 0:
                            _context2.next = 2;
                            return (0, _etask2.default)(function () {
                                return _axios2.default.get('/api/req_status');
                            });

                        case 2:
                            res = _context2.sent;
                            return _context2.abrupt('return', res.data);

                        case 4:
                        case 'end':
                            return _context2.stop();
                    }
                }
            }, _callee2, this);
        }));
        return _this8;
    }

    _createClass(SuccessRatio, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee3() {
                return _regeneratorRuntime2.default.wrap(function _callee3$(_context3) {
                    while (1) {
                        switch (_context3.prev = _context3.next) {
                            case 0:
                                if (false) {
                                    _context3.next = 10;
                                    break;
                                }

                                _context3.t0 = _this;
                                _context3.next = 4;
                                return _this.get_req_status_stats();

                            case 4:
                                _context3.t1 = _context3.sent;

                                _context3.t0.setState.call(_context3.t0, _context3.t1);

                                _context3.next = 8;
                                return _etask2.default.sleep(3000);

                            case 8:
                                _context3.next = 0;
                                break;

                            case 10:
                            case 'end':
                                return _context3.stop();
                        }
                    }
                }, _callee3, this);
            })));
        }
    }, {
        key: 'render',
        value: function render() {
            var _state = this.state,
                total = _state.total,
                success = _state.success;

            var ratio = total == 0 ? 0 : success / total * 100;
            var overallSuccessTooltip = _react2.default.createElement(
                _reactBootstrap.Tooltip,
                {
                    id: 'succes-tooltip' },
                'Ratio of successful requests out of total requests, where successful requests are calculated as 2xx, 3xx or 404 HTTP status codes'
            );
            return _react2.default.createElement(
                _reactBootstrap.OverlayTrigger,
                { overlay: overallSuccessTooltip,
                    placement: 'top' },
                _react2.default.createElement(
                    _reactBootstrap.Row,
                    { className: 'overall-success-ratio', onMouseEnter: function onMouseEnter() {
                            _util2.default.ga_event('stats panel', 'hover', 'success_ratio', ratio);
                        } },
                    _react2.default.createElement(
                        _reactBootstrap.Col,
                        { md: 6, className: 'success_title' },
                        'Overall success'
                    ),
                    _react2.default.createElement(
                        _reactBootstrap.Col,
                        { md: 6, className: 'success_value' },
                        ratio.toFixed(2),
                        '%'
                    )
                )
            );
        }
    }]);

    return SuccessRatio;
}(_react2.default.Component);

var Stats = function (_React$Component4) {
    _inherits(Stats, _React$Component4);

    function Stats(props) {
        _classCallCheck(this, Stats);

        var _this9 = _possibleConstructorReturn(this, (Stats.__proto__ || Object.getPrototypeOf(Stats)).call(this, props));

        _this9.get_stats = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee4(_this) {
            return _regeneratorRuntime2.default.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            this.catch(function (e) {
                                return console.log(e);
                            });

                        case 1:
                            if (false) {
                                _context4.next = 11;
                                break;
                            }

                            _context4.t0 = _this;
                            _context4.next = 5;
                            return _common2.default.StatsService.get_top({ sort: 'value',
                                limit: 5 });

                        case 5:
                            _context4.t1 = _context4.sent;

                            _context4.t0.setState.call(_context4.t0, _context4.t1);

                            _context4.next = 9;
                            return _etask2.default.sleep(_date2.default.ms.SEC);

                        case 9:
                            _context4.next = 1;
                            break;

                        case 11:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        _this9.close = function () {
            return _this9.setState({ show_reset: false });
        };

        _this9.confirm = function () {
            return _this9.setState({ show_reset: true });
        };

        _this9.reset_stats = function () {
            if (_this9.state.resetting) return;
            _this9.setState({ resetting: true });
            var _this = _this9;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee5() {
                return _regeneratorRuntime2.default.wrap(function _callee5$(_context5) {
                    while (1) {
                        switch (_context5.prev = _context5.next) {
                            case 0:
                                _context5.next = 2;
                                return _common2.default.StatsService.reset();

                            case 2:
                                _this.setState({ resetting: undefined });
                                _this.close();

                            case 4:
                            case 'end':
                                return _context5.stop();
                        }
                    }
                }, _callee5, this);
            })));
            _util2.default.ga_event('stats panel', 'click', 'reset btn');
        };

        _this9.enable_https_statistics = function () {
            _this9.setState({ show_certificate: true });
            _util2.default.ga_event('stats panel', 'click', 'enable https stats');
        };

        _this9.close_certificate = function () {
            _this9.setState({ show_certificate: false });
        };

        _this9.state = {
            statuses: { stats: [] },
            domains: { stats: [] },
            protocols: { stats: [] }
        };
        return _this9;
    }

    _createClass(Stats, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            E.sp.spawn(this.get_stats());
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactBootstrap.Panel,
                { header: _react2.default.createElement(
                        _reactBootstrap.Row,
                        null,
                        _react2.default.createElement(
                            _reactBootstrap.Col,
                            { md: 6 },
                            'Recent statistics'
                        ),
                        _react2.default.createElement(
                            _reactBootstrap.Col,
                            { md: 6, className: 'text-right' },
                            _react2.default.createElement(
                                _reactBootstrap.Button,
                                { bsSize: 'xsmall', onClick: this.confirm },
                                'Reset'
                            )
                        )
                    ) },
                _react2.default.createElement(SuccessRatio, null),
                _react2.default.createElement(StatTable, { table: _status_codes.StatusCodeTable, row: SRow,
                    title: 'Top status codes', dataType: 'status_codes',
                    stats: this.state.statuses.stats,
                    show_more: this.state.statuses.has_more }),
                _react2.default.createElement(StatTable, { table: _domains.DomainTable, row: DRow,
                    dataType: 'domains', stats: this.state.domains.stats,
                    show_more: this.state.domains.has_more,
                    title: 'Top domains' }),
                _react2.default.createElement(StatTable, { table: _protocols.ProtocolTable, row: PRow,
                    dataType: 'protocols', stats: this.state.protocols.stats,
                    show_more: this.state.protocols.has_more,
                    title: 'All protocols',
                    show_enable_https_button: true,
                    enable_https_button_click: this.enable_https_statistics }),
                _react2.default.createElement(
                    _common3.Dialog,
                    { show: this.state.show_reset, onHide: this.close,
                        title: 'Reset stats', footer: _react2.default.createElement(
                            _reactBootstrap.ButtonToolbar,
                            null,
                            _react2.default.createElement(
                                _reactBootstrap.Button,
                                { bsStyle: 'primary', onClick: this.reset_stats,
                                    disabled: this.state.resetting },
                                this.state.resetting ? 'Resetting...' : 'OK'
                            ),
                            _react2.default.createElement(
                                _reactBootstrap.Button,
                                { onClick: this.close },
                                'Cancel'
                            )
                        ) },
                    _react2.default.createElement(
                        'h4',
                        null,
                        'Are you sure you want to reset stats?'
                    )
                ),
                _react2.default.createElement(
                    _common3.Dialog,
                    { show: this.state.show_certificate,
                        onHide: this.close_certificate,
                        title: 'Add certificate file to browsers',
                        footer: _react2.default.createElement(
                            _reactBootstrap.Button,
                            { onClick: this.close_certificate },
                            'Close'
                        ) },
                    'Gathering stats for HTTPS requests requires setting a certificate key.',
                    _react2.default.createElement(
                        'ol',
                        null,
                        _react2.default.createElement(
                            'li',
                            null,
                            'Download our free certificate key',
                            _react2.default.createElement(
                                'a',
                                { href: '/ssl', target: '_blank', download: true },
                                ' here'
                            )
                        ),
                        _react2.default.createElement(
                            'li',
                            null,
                            'Add the certificate to your browser'
                        ),
                        _react2.default.createElement(
                            'li',
                            null,
                            'Refresh the page'
                        )
                    )
                )
            );
        }
    }]);

    return Stats;
}(_react2.default.Component);

exports.default = Stats;

/***/ }),

/***/ 47:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint browser:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
var E = {};

E.bytes_format = function (bytes, precision) {
    if (!bytes || isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '';
    var number = Math.floor(Math.log(bytes) / Math.log(1000));
    if (typeof precision === 'undefined') precision = number ? 2 : 0;
    var number_format = Intl.NumberFormat('en-US', { maximumFractionDigits: precision });
    return number_format.format(bytes / Math.pow(1000, Math.floor(number))) + ' ' + ['B', 'KB', 'MB', 'GB', 'TB', 'PB'][number];
};

var ga = void 0;
E.init_ga = function (_ga) {
    return ga = _ga;
};

E.ga_event = function (category, action, label) {
    return ga && ga.trackEvent(category, action, label, undefined, undefined, { transport: 'beacon' });
};

exports.default = E;

/***/ }),

/***/ 616:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
/*jslint skip_file:true*/
(function(){

var is_node = typeof module=='object' && module.exports && module.children;
if (!is_node)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){

/**
 * Minimal EventEmitter interface that is molded against the Node.js
 * EventEmitter interface.
 *
 * @constructor
 * @api public
 */
function EventEmitter() {
  this._events = {};
}

/**
 * Return a list of assigned event listeners.
 *
 * @param {String} event The events that should be listed.
 * @returns {Array}
 * @api public
 */
EventEmitter.prototype.listeners = function listeners(event) {
  return Array.apply(this, this._events[event] || []);
};

/**
 * Emit an event to all registered event listeners.
 *
 * @param {String} event The name of the event.
 * @returns {Boolean} Indication if we've emitted an event.
 * @api public
 */
EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  if (!this._events || !this._events[event]) return false;

  var listeners = this._events[event]
    , length = listeners.length
    , len = arguments.length
    , fn = listeners[0]
    , args
    , i;

  if (1 === length) {
    switch (len) {
      case 1:
        fn.call(fn.__EE3_context || this);
      break;
      case 2:
        fn.call(fn.__EE3_context || this, a1);
      break;
      case 3:
        fn.call(fn.__EE3_context || this, a1, a2);
      break;
      case 4:
        fn.call(fn.__EE3_context || this, a1, a2, a3);
      break;
      case 5:
        fn.call(fn.__EE3_context || this, a1, a2, a3, a4);
      break;
      case 6:
        fn.call(fn.__EE3_context || this, a1, a2, a3, a4, a5);
      break;

      default:
        for (i = 1, args = new Array(len -1); i < len; i++) {
          args[i - 1] = arguments[i];
        }

        fn.apply(fn.__EE3_context || this, args);
    }

    if (fn.__EE3_once) this.removeListener(event, fn);
  } else {
    for (i = 1, args = new Array(len -1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    for (i = 0; i < length; fn = listeners[++i]) {
      fn.apply(fn.__EE3_context || this, args);
      if (fn.__EE3_once) this.removeListener(event, fn);
    }
  }

  return true;
};

function _addListener(event, fn, context, prepend) {
  if (!this._events) this._events = {};
  if (!this._events[event]) this._events[event] = [];

  fn.__EE3_context = context;
  if (prepend)
      this._events[event].unshift(fn);
  else
      this._events[event].push(fn);

  return this;
}

/**
 * Register a new EventListener for the given event.
 *
 * @param {String} event Name of the event.
 * @param {Functon} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.on = function on(event, fn, context) {
  return _addListener.apply(this, [event, fn, context]);
};

/**
 * Add an EventListener that's only called once.
 *
 * @param {String} event Name of the event.
 * @param {Function} fn Callback function.
 * @param {Mixed} context The context of the function.
 * @api public
 */
EventEmitter.prototype.once = function once(event, fn, context) {
  fn.__EE3_once = true;
  return this.on(event, fn, context);
};

EventEmitter.prototype.prependListener = function prependListener(event, fn,
    context)
{
  return _addListener.apply(this, [event, fn, context, true]);
};

EventEmitter.prototype.prependOnceListener = function prependOnceListener(
    event, fn, context)
{
    fn.__EE3_once = true;
    return this.prependListener(event, fn, context);
};

/**
 * Remove event listeners.
 *
 * @param {String} event The event we want to remove.
 * @param {Function} fn The listener that we need to find.
 * @api public
 */
EventEmitter.prototype.removeListener = function removeListener(event, fn) {
  if (!this._events || !this._events[event]) return this;

  var listeners = this._events[event]
    , events = [];

  for (var i = 0, length = listeners.length; i < length; i++) {
    if (fn && listeners[i] !== fn) {
      events.push(listeners[i]);
    }
  }

  //
  // Reset the array, or remove it completely if we have no more listeners.
  //
  if (events.length) this._events[event] = events;
  else this._events[event] = null;

  return this;
};

/**
 * Remove all listeners or only the listeners for the specified event.
 *
 * @param {String} event The event want to remove all listeners for.
 * @api public
 */
EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  if (!this._events) return this;

  if (event) this._events[event] = null;
  else this._events = {};

  return this;
};

//
// Alias methods names because people roll like that.
//
EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;

//
// This function doesn't apply anymore.
//
EventEmitter.prototype.setMaxListeners = function setMaxListeners() {
  return this;
};

EventEmitter.prototype.eventNames = function eventNames(){
    var _this = this;
    return Object.keys(this._events).filter(function(e){
        return _this._events[e]!==null;
    });
}

//
// Expose the module.
//
EventEmitter.EventEmitter = EventEmitter;
EventEmitter.EventEmitter2 = EventEmitter;
EventEmitter.EventEmitter3 = EventEmitter;

return EventEmitter; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); })();


/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _moment = __webpack_require__(137);

var _moment2 = _interopRequireDefault(_moment);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _axios = __webpack_require__(182);

var _axios2 = _interopRequireDefault(_axios);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var StatTable = function (_React$Component) {
    _inherits(StatTable, _React$Component);

    function StatTable() {
        _classCallCheck(this, StatTable);

        return _possibleConstructorReturn(this, (StatTable.__proto__ || Object.getPrototypeOf(StatTable)).apply(this, arguments));
    }

    _createClass(StatTable, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var Row = this.props.row;
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h4',
                    null,
                    this.props.title,
                    this.props.show_more && _react2.default.createElement(
                        'small',
                        null,
                        '\xA0',
                        _react2.default.createElement(
                            'a',
                            { href: this.props.path },
                            'show all'
                        )
                    )
                ),
                _react2.default.createElement(
                    _reactBootstrap.Table,
                    { hover: true, condensed: true },
                    _react2.default.createElement(
                        'thead',
                        null,
                        this.props.children
                    ),
                    _react2.default.createElement(
                        'tbody',
                        null,
                        this.props.stats.map(function (s) {
                            return _react2.default.createElement(Row, _extends({ stat: s, key: s[_this3.props.row_key || 'key'],
                                path: _this3.props.path, go: _this3.props.go
                            }, _this3.props.row_opts || {}));
                        })
                    )
                )
            );
        }
    }]);

    return StatTable;
}(_react2.default.Component);

var StatsService = function StatsService() {
    _classCallCheck(this, StatsService);
};

StatsService.base = '/api/request_stats';
StatsService.get_top = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(_this) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var res, assign, state, _arr, _i, k;

    return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
        while (1) {
            switch (_context.prev = _context.next) {
                case 0:
                    _context.next = 2;
                    return _this.get('top');

                case 2:
                    res = _context.sent;
                    assign = Object.assign;

                    opt = assign({ reverse: true }, opt);
                    state = _lodash2.default.reduce(res, function (s, v, k) {
                        if (_lodash2.default.isInteger(+k)) return s.statuses.stats.push(assign({ status_code: k,
                            value: v.count, bw: v.bw }, v)) && s;
                        if (['http', 'https'].includes(k)) {
                            return s.protocols.stats.push(assign({ protocol: k, bw: v.bw,
                                value: v.count }, v)) && s;
                        }
                        return s.domains.stats.push(assign({ hostname: k, value: v.count,
                            bw: v.bw }, v)) && s;
                    }, { statuses: { stats: [] }, domains: { stats: [] },
                        protocols: { stats: [] } });

                    if (!state.protocols.stats.some(_lodash2.default.matches({ protocol: 'https' }))) state.protocols.stats.push({ protocol: 'https', bw: 0, value: 0 });
                    if (opt.sort || opt.limit) {
                        _arr = ['statuses', 'domains', 'protocols'];

                        for (_i = 0; _i < _arr.length; _i++) {
                            k = _arr[_i];

                            state[k] = {
                                has_more: state[k].stats.length > (opt.limit || Infinity),
                                stats: (0, _lodash2.default)(state[k].stats)
                            };
                            if (opt.sort) {
                                state[k].stats = state[k].stats.sortBy(_lodash2.default.isString(opt.sort) && opt.sort || 'value');
                            }
                            if (opt.limit) {
                                state[k].stats = state[k].stats['take' + (opt.reverse && 'Right' || '')](opt.limit);
                            }
                            if (opt.reverse) state[k].stats = state[k].stats.reverse();
                            state[k].stats = state[k].stats.value();
                        }
                    }
                    return _context.abrupt('return', state);

                case 9:
                case 'end':
                    return _context.stop();
            }
        }
    }, _callee, this);
}));
StatsService.get_all = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee2(_this) {
    var opt = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var res;
    return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
        while (1) {
            switch (_context2.prev = _context2.next) {
                case 0:
                    opt = Object.assign({ reverse: 1 }, opt);
                    _context2.next = 3;
                    return _this.get('all');

                case 3:
                    res = _context2.sent;

                    if (opt.by) {
                        res = (0, _lodash2.default)(Object.values(res.reduce(function (s, v, k) {
                            var c = v[opt.by];
                            s[c] = s[c] || Object.assign({ value: 0, bw: 0 }, v);
                            s[c].value += 1;
                            s[c].bw += v.bw;
                            return s;
                        }, {})));
                    } else res = (0, _lodash2.default)(res);
                    if (opt.sort) res = res.sortBy(_lodash2.default.isString(opt.sort) && opt.sort || 'value');
                    if (opt.reverse) res = res.reverse();
                    return _context2.abrupt('return', res.value());

                case 8:
                case 'end':
                    return _context2.stop();
            }
        }
    }, _callee2, this);
}));
StatsService.reset = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee3(_this) {
    return _regeneratorRuntime2.default.wrap(function _callee3$(_context3) {
        while (1) {
            switch (_context3.prev = _context3.next) {
                case 0:
                    _context3.next = 2;
                    return _this.get('reset');

                case 2:
                    return _context3.abrupt('return', _context3.sent);

                case 3:
                case 'end':
                    return _context3.stop();
            }
        }
    }, _callee3, this);
}));
StatsService.get = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee4(_, stats) {
    var res;
    return _regeneratorRuntime2.default.wrap(function _callee4$(_context4) {
        while (1) {
            switch (_context4.prev = _context4.next) {
                case 0:
                    _context4.next = 2;
                    return (0, _etask2.default)(function () {
                        return _axios2.default.get(StatsService.base + '/' + stats);
                    });

                case 2:
                    res = _context4.sent;
                    return _context4.abrupt('return', res.data[stats]);

                case 4:
                case 'end':
                    return _context4.stop();
            }
        }
    }, _callee4, this);
}));

var StatsDetails = function (_React$Component2) {
    _inherits(StatsDetails, _React$Component2);

    function StatsDetails(props) {
        _classCallCheck(this, StatsDetails);

        var _this4 = _possibleConstructorReturn(this, (StatsDetails.__proto__ || Object.getPrototypeOf(StatsDetails)).call(this, props));

        _this4.page_change = function (page) {
            return _this4.paginate(page - 1);
        };

        _this4.state = {
            stats: [],
            all_stats: props.stats || [],
            cur_page: 0,
            items_per_page: props.items_per_page || 10
        };
        return _this4;
    }

    _createClass(StatsDetails, [{
        key: 'componentWillReceiveProps',
        value: function componentWillReceiveProps(props) {
            var _this5 = this;

            var update = {};
            if (props.items_per_page != this.props.items_per_page) Object.assign(update, { items_per_page: props.items_per_page });
            if (props.stats != this.props.stats) Object.assign(update, { all_stats: props.stats });
            if (Object.keys(update).length) this.setState(update, function () {
                return _this5.paginate();
            });
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            this.paginate();
        }
    }, {
        key: 'paginate',
        value: function paginate() {
            var page = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : -1;

            page = page > -1 ? page : this.state.cur_page;
            var stats = this.state.all_stats;
            var cur_page = _lodash2.default.min([Math.ceil(stats.length / this.state.items_per_page), page]);
            this.setState({
                stats: stats.slice(cur_page * this.state.items_per_page, (cur_page + 1) * this.state.items_per_page),
                cur_page: cur_page
            });
        }
    }, {
        key: 'render_headers',
        value: function render_headers() {
            var headers = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            var hds = Object.keys(headers).map(function (h) {
                return _react2.default.createElement(
                    'div',
                    { className: 'request_headers_header', key: h },
                    h,
                    ': ',
                    headers[h]
                );
            });
            return _react2.default.createElement(
                'div',
                { className: 'request_headers' },
                hds
            );
        }
    }, {
        key: 'render',
        value: function render() {
            var _this6 = this;

            var pagination = null;
            if (this.state.all_stats.length > this.state.items_per_page) {
                var next = false;
                var pages = Math.ceil(this.state.all_stats.length / this.state.items_per_page);
                if (this.state.cur_page + 1 < pages) next = 'Next';
                pagination = _react2.default.createElement(_reactBootstrap.Pagination, { next: next, boundaryLinks: true,
                    activePage: this.state.cur_page + 1,
                    bsSize: 'small', onSelect: this.page_change,
                    items: pages, maxButtons: 5 });
            }
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'page-header' },
                    _react2.default.createElement(
                        'h3',
                        null,
                        this.props.header
                    )
                ),
                _react2.default.createElement(
                    'div',
                    null,
                    this.props.title,
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Requests'
                    ),
                    _react2.default.createElement(
                        _reactBootstrap.Table,
                        { hover: true, className: 'table-consolidate' },
                        _react2.default.createElement(
                            'thead',
                            null,
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'th',
                                    { className: 'col-sm-6' },
                                    'URL'
                                ),
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'Bandwidth'
                                ),
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'Response time'
                                ),
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'Date'
                                ),
                                _react2.default.createElement(
                                    'th',
                                    null,
                                    'IP used'
                                )
                            )
                        ),
                        _react2.default.createElement(
                            'tbody',
                            null,
                            this.state.stats.map(function (s, i) {
                                var rh = JSON.parse(s.response_headers);
                                var local = (0, _moment2.default)(rh.date).format('YYYY-MM-DD HH:mm:ss');
                                return _react2.default.createElement(
                                    'tr',
                                    { key: i },
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        s.url,
                                        _this6.render_headers(JSON.parse(s.request_headers))
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        _util2.default.bytes_format(s.bw)
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        s.response_time,
                                        ' ms'
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        local
                                    ),
                                    _react2.default.createElement(
                                        'td',
                                        null,
                                        s.proxy_peer
                                    )
                                );
                            })
                        ),
                        _react2.default.createElement(
                            'tfoot',
                            null,
                            _react2.default.createElement(
                                'tr',
                                null,
                                _react2.default.createElement(
                                    'td',
                                    { colSpan: 5 },
                                    pagination
                                )
                            )
                        )
                    ),
                    this.props.children
                )
            );
        }
    }]);

    return StatsDetails;
}(_react2.default.Component);

exports.default = { StatsDetails: StatsDetails, StatTable: StatTable, StatsService: StatsService };

/***/ }),

/***/ 636:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

var _status_codes = __webpack_require__(98);

var _domains = __webpack_require__(128);

var _protocols = __webpack_require__(129);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        E.sp = (0, _etask2.default)('status_codes_detail', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var StatsDetails = function (_React$Component) {
    _inherits(StatsDetails, _React$Component);

    function StatsDetails(props) {
        _classCallCheck(this, StatsDetails);

        var _this2 = _possibleConstructorReturn(this, (StatsDetails.__proto__ || Object.getPrototypeOf(StatsDetails)).call(this, props));

        _this2.state = {
            domains: { stats: [] },
            protocols: { stats: [] }
        };
        return _this2;
    }

    _createClass(StatsDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.t0 = _this;
                                _context.next = 3;
                                return _common2.default.StatsService.get(_this.props.code);

                            case 3:
                                _context.t1 = _context.sent;
                                _context.t2 = {
                                    stats: _context.t1
                                };

                                _context.t0.setState.call(_context.t0, _context.t2);

                                _context.next = 8;
                                return _common2.default.StatsService.get_top({ sort: 1, limit: 5 });

                            case 8:
                                res = _context.sent;

                                _this.setState(_lodash2.default.pick(res, ['domains', 'protocols']));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            var definition = _status_codes.status_codes[this.props.code] ? '(' + _status_codes.status_codes[this.props.code] + ')' : '';
            var header_text = 'Status code: ' + this.props.code + ' ' + definition;
            return _react2.default.createElement(
                _common2.default.StatsDetails,
                { stats: this.state.stats,
                    header: header_text },
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Domains'
                    ),
                    _react2.default.createElement(_domains.DomainTable, { stats: this.state.domains.stats, go: true })
                ),
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Protocols'
                    ),
                    _react2.default.createElement(_protocols.ProtocolTable, { stats: this.state.protocols.stats, go: true })
                )
            );
        }
    }]);

    return StatsDetails;
}(_react2.default.Component);

exports.default = StatsDetails;

/***/ }),

/***/ 637:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

var _status_codes = __webpack_require__(98);

var _protocols = __webpack_require__(129);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('domains_detail', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var StatsDetails = function (_React$Component) {
    _inherits(StatsDetails, _React$Component);

    function StatsDetails(props) {
        _classCallCheck(this, StatsDetails);

        var _this2 = _possibleConstructorReturn(this, (StatsDetails.__proto__ || Object.getPrototypeOf(StatsDetails)).call(this, props));

        _this2.state = {
            statuses: { stats: [] },
            protocols: { stats: [] }
        };
        return _this2;
    }

    _createClass(StatsDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.t0 = _this;
                                _context.next = 3;
                                return _common2.default.StatsService.get(_this.props.domain);

                            case 3:
                                _context.t1 = _context.sent;
                                _context.t2 = {
                                    stats: _context.t1
                                };

                                _context.t0.setState.call(_context.t0, _context.t2);

                                _context.next = 8;
                                return _common2.default.StatsService.get_top({ sort: 1, limit: 5 });

                            case 8:
                                res = _context.sent;

                                _this.setState(_lodash2.default.pick(res, ['statuses', 'protocols']));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _common2.default.StatsDetails,
                { stats: this.state.stats,
                    header: 'Domain name: ' + this.props.domain },
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Status codes'
                    ),
                    _react2.default.createElement(_status_codes.StatusCodeTable, { stats: this.state.statuses.stats, go: true })
                ),
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Protocols'
                    ),
                    _react2.default.createElement(_protocols.ProtocolTable, { stats: this.state.protocols.stats, go: true })
                )
            );
        }
    }]);

    return StatsDetails;
}(_react2.default.Component);

exports.default = StatsDetails;

/***/ }),

/***/ 638:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _ajax = __webpack_require__(296);

var _ajax2 = _interopRequireDefault(_ajax);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _howto = __webpack_require__(327);

var _howto2 = _interopRequireDefault(_howto);

var _common = __webpack_require__(64);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ga_event = _util2.default.ga_event;
var steps = _common.onboarding_steps;
var localhost = window.location.origin;

var Page = function (_React$Component) {
    _inherits(Page, _React$Component);

    function Page(props) {
        _classCallCheck(this, Page);

        var _this = _possibleConstructorReturn(this, (Page.__proto__ || Object.getPrototypeOf(Page)).call(this, props));

        var step = JSON.parse(window.localStorage.getItem('quickstart-step'));
        if (!Object.values(steps).includes(Number(step))) step = steps.WELCOME;
        _this.state = { step: step };
        return _this;
    }

    _createClass(Page, [{
        key: 'set_step',
        value: function set_step(step) {
            if (step == steps.ADD_PROXY) ga_event('lpm-onboarding', '03 intro page next');
            if (step == steps.HOWTO) {
                ga_event('lpm-onboarding', '05 first request button clicked');
            }
            if (step == steps.HOWTO_DONE) window.location = '/proxies';
            window.localStorage.setItem('quickstart-step', step);
            this.setState({ step: step });
        }
    }, {
        key: 'render',
        value: function render() {
            var Current_page = void 0;
            switch (this.state.step) {
                case steps.WELCOME:
                    Current_page = Welcome;break;
                case steps.ADD_PROXY:
                case steps.HOWTO_DONE:
                case steps.ADD_PROXY_DONE:
                    Current_page = List;break;
                case steps.HOWTO:
                    Current_page = Howto_wrapper;break;
                default:
                    Current_page = Welcome;
            }
            return _react2.default.createElement(
                'div',
                { className: 'intro lpm' },
                _react2.default.createElement(Current_page, { set_step: this.set_step.bind(this),
                    curr_step: this.state.step })
            );
        }
    }]);

    return Page;
}(_react2.default.Component);

var Done_btn = function Done_btn(props) {
    return _react2.default.createElement(
        'button',
        { onClick: props.on_click, className: 'btn btn_lpm btn_done' },
        'Done'
    );
};

var Howto_wrapper = function Howto_wrapper(props) {
    var click_done = function click_done(option) {
        return function () {
            props.set_step(steps.HOWTO_DONE);
            ga_event('lpm-onboarding', '07 click done', option);
        };
    };
    return _react2.default.createElement(
        _howto2.default,
        { ga_category: 'onboarding' },
        _react2.default.createElement(Done_btn, { on_click: click_done })
    );
};

var Welcome = function Welcome(props) {
    return _react2.default.createElement(
        'div',
        { className: 'header' },
        _react2.default.createElement(
            'h1',
            null,
            'Welcome to Luminati Proxy Manager'
        ),
        _react2.default.createElement(
            'h2',
            { className: 'sub_header' },
            'How it works'
        ),
        _react2.default.createElement(
            'div',
            { className: 'sub_header' },
            _react2.default.createElement(
                'h4',
                null,
                'Create multiple proxy ports, each with its own unique configuration, for maximum performance and greater scalability'
            )
        ),
        _react2.default.createElement('div', { className: 'img_intro' }),
        _react2.default.createElement(
            'button',
            { className: 'btn btn-primary btn_lpm btn_lpm_big',
                onClick: function onClick() {
                    return props.set_step(steps.ADD_PROXY);
                } },
            "Let's go"
        )
    );
};

var List = function (_React$Component2) {
    _inherits(List, _React$Component2);

    function List(props) {
        _classCallCheck(this, List);

        var _this2 = _possibleConstructorReturn(this, (List.__proto__ || Object.getPrototypeOf(List)).call(this, props));

        var create = window.localStorage.getItem('quickstart-create-proxy');
        var test = window.localStorage.getItem('quickstart-test-proxy');
        _this2.state = { create: create, test: test };
        return _this2;
    }

    _createClass(List, [{
        key: 'click_add_proxy',
        value: function click_add_proxy() {
            window.location.href = localhost + '/proxies?action=tutorial_add_proxy';
        }
    }, {
        key: 'skip_to_dashboard',
        value: function skip_to_dashboard() {
            ga_event('lpm-onboarding', '04 tutorial skipped');
            window.location.href = localhost + '/proxies';
        }
    }, {
        key: 'render',
        value: function render() {
            var _this3 = this;

            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'h1',
                    { className: 'header' },
                    'Welcome to Luminati Proxy Manager'
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'sub_header' },
                    _react2.default.createElement(
                        'h4',
                        null,
                        'Configure a new port with specific proxy settings and use it to browse the internet'
                    )
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'section_list' },
                    _react2.default.createElement(Section, { header: 'Configure new proxy port', img: '1',
                        text: 'Specific proxy settings to be applied on this port',
                        on_click: this.click_add_proxy }),
                    _react2.default.createElement(Section, { header: 'Make your first request', img: '2',
                        text: '',
                        on_click: function on_click() {
                            return _this3.props.set_step(steps.HOWTO);
                        },
                        disabled: this.props.curr_step < steps.ADD_PROXY_DONE }),
                    _react2.default.createElement(
                        'a',
                        { onClick: this.skip_to_dashboard.bind(this) },
                        'Skip to dashboard'
                    )
                )
            );
        }
    }]);

    return List;
}(_react2.default.Component);

var Section = function Section(props) {
    var img_class = 'img img_' + props.img + (props.disabled ? '' : '_active');
    var on_click = function on_click() {
        if (props.disabled) return;
        props.on_click();
    };
    return _react2.default.createElement(
        'div',
        { onClick: on_click,
            className: 'section' + (props.disabled ? ' disabled' : '') },
        _react2.default.createElement(
            'div',
            { className: 'img_block' },
            _react2.default.createElement('div', { className: 'circle_wrapper' }),
            _react2.default.createElement('div', { className: img_class })
        ),
        _react2.default.createElement(
            'div',
            { className: 'text_block' },
            _react2.default.createElement(
                'div',
                { className: 'title' },
                props.header
            ),
            _react2.default.createElement(
                'div',
                { className: 'subtitle' },
                props.text
            )
        ),
        _react2.default.createElement('div', { className: 'right_arrow' })
    );
};

exports.default = Page;

/***/ }),

/***/ 64:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.presets = exports.onboarding_steps = exports.Code = exports.Dialog = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Dialog = function (_React$Component) {
    _inherits(Dialog, _React$Component);

    function Dialog() {
        _classCallCheck(this, Dialog);

        return _possibleConstructorReturn(this, (Dialog.__proto__ || Object.getPrototypeOf(Dialog)).apply(this, arguments));
    }

    _createClass(Dialog, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactBootstrap.Modal,
                _lodash2.default.omit(this.props, ['title', 'footer', 'children']),
                _react2.default.createElement(
                    _reactBootstrap.Modal.Header,
                    { closeButton: true },
                    _react2.default.createElement(
                        _reactBootstrap.Modal.Title,
                        null,
                        this.props.title
                    )
                ),
                _react2.default.createElement(
                    _reactBootstrap.Modal.Body,
                    null,
                    this.props.children
                ),
                _react2.default.createElement(
                    _reactBootstrap.Modal.Footer,
                    null,
                    this.props.footer
                )
            );
        }
    }]);

    return Dialog;
}(_react2.default.Component);

var Code = function Code(props) {
    var copy = function copy() {
        if (props.on_click) props.on_click();
        var area = document.querySelector('#copy_' + props.id + '>textarea');
        var source = document.querySelector('#copy_' + props.id + '>.source');
        area.value = source.innerText;
        area.select();
        try {
            document.execCommand('copy');
        } catch (e) {
            console.log('Oops, unable to copy');
        }
    };
    var value = props.children.innerText ? props.children.innerText() : props.children;
    return _react2.default.createElement(
        'code',
        { id: 'copy_' + props.id },
        _react2.default.createElement(
            'span',
            { className: 'source' },
            props.children
        ),
        _react2.default.createElement('textarea', { defaultValue: value,
            style: { position: 'fixed', top: '-1000px' } }),
        _react2.default.createElement(
            'button',
            { onClick: copy,
                className: 'btn btn_lpm btn_lpm_default btn_copy' },
            'Copy'
        )
    );
};

var onboarding_steps = {
    WELCOME: 0,
    ADD_PROXY: 1,
    ADD_PROXY_DONE: 2,
    HOWTO: 3,
    HOWTO_DONE: 4
};

var presets = [{
    id: 'session_long',
    title: 'Long single session (IP)'
}, {
    id: 'session',
    title: 'Single session (IP)'
}, {
    id: 'sticky_ip',
    title: 'Session (IP) per machine'
}, {
    id: 'sequential',
    title: 'Sequential session (IP) pool'
}, {
    id: 'round_robin',
    title: 'Round-robin (IP) pool'
}, {
    id: 'custom',
    title: 'Custom'
}];

exports.Dialog = Dialog;
exports.Code = Code;
exports.onboarding_steps = onboarding_steps;
exports.presets = presets;

/***/ }),

/***/ 678:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){
var  process;
var is_node = typeof module=='object' && module.exports && module.children;
var is_ff_addon = typeof module=='object' && module.uri
    && !module.uri.indexOf('resource://');
if (!is_node && !is_ff_addon)
{
    ;
    process = {env: {}};
}
else
{
    ;
    if (is_ff_addon)
        process = {env: {}};
    else if (is_node)
    {
        process = global.process||require('_process');
        require('./config.js');
        var cluster = require('cluster');
        var fs = require('fs');
        var version = require('./version.js').version;
    }
}
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(181), __webpack_require__(105), __webpack_require__(289),
    __webpack_require__(679), __webpack_require__(680), __webpack_require__(326)], __WEBPACK_AMD_DEFINE_RESULT__ = function(array, date, zutil, sprintf, rate_limit, zescape){
var E, _zerr;
var env = process.env;
var zerr = function(msg){ _zerr(L.ERR, arguments); };
E = zerr;
// XXX amir: why do we need both E and E.zerr to point to the same function?
E.zerr = zerr;
var L = E.L = {
    EMERG: 0,
    ALERT: 1,
    CRIT: 2,
    ERR: 3,
    WARN: 4,
    NOTICE: 5,
    INFO: 6,
    DEBUG: 7,
};
var perr_pending = [];
// inverted
var LINV = E.LINV = {};
for (var k in L)
    LINV[L[k]] = k;

['debug', 'info', 'notice', 'warn', 'err', 'crit'].forEach(function(l){
    var level = L[l.toUpperCase()];
    E[l] = function(){ return _zerr(level, arguments); };
});

E.assert = function(exp, msg){
    if (!exp)
        zerr.crit(msg);
};

E.json = function(o, replacer, space){
    try { return JSON.stringify(o, replacer, space)||''; }
    catch(err){ return '[circular]'; }
};

E.is = function(level){ return level<=E.level; };
['debug', 'info', 'notice', 'warn', 'err'].forEach(function(l){
    var level = L[l.toUpperCase()];
    E.is[l] = function(){ return level<=E.level; };
});

E.log_tail = function(size){ return E.log.join('\n').substr(-(size||4096)); };

/* perr is a stub overridden by upper layers */
E.perr = function(id, info, opt){
    E._zerr(!opt || opt.level===undefined ? L.ERR : opt.level,
        ['perr '+id+' '+E.json(info)]);
    if (perr_pending && perr_pending.length<100)
        perr_pending.push(Array.from(arguments));
};
var perr_dropped = {};
var perr_orig = E.perr;
function wrap_perr(perr_fn){
    var send = perr_fn, pre_send;
    if (typeof perr_fn!='function')
    {
        send = perr_fn.send;
        pre_send = perr_fn.pre_send;
    }
    return function(id, info, opt){
        opt = opt||{};
        var ms = (opt.rate_limit && opt.rate_limit.ms)||date.ms.HOUR;
        var count = (opt.rate_limit && opt.rate_limit.count)||10;
        var rl_hash = perr_orig.rl_hash = perr_orig.rl_hash||{};
        var rl = rl_hash[id] = rl_hash[id]||{};
        if (pre_send)
            pre_send(id, info, opt);
        if (opt.rate_limit===false || rate_limit(rl, ms, count))
        {
            if (perr_dropped[id])
            {
                if (info && typeof info!='string')
                    info.w = perr_dropped[id];
                perr_dropped[id] = null;
            }
            return send(id, info, opt);
        }
        perr_dropped[id] = (perr_dropped[id]||0)+1;
        if (info && typeof info!='string')
            info = zerr.json(info);
        zerr('perr %s %s rate too high %s %d %d', id, info, zerr.json(rl), ms,
            count);
    };
}
E.perr_install = function(install_fn){
    E.perr = wrap_perr(install_fn(perr_orig, perr_pending||[]));
    perr_pending = null;
};

function err_has_stack(err){ return err instanceof Error && err.stack; }

E.e2s = function(err){
    if (!is_node && err_has_stack(err))
    {
        var e_str = ''+err, e_stack = ''+err.stack;
        return e_stack.startsWith(e_str) ? e_stack : e_str+' '+e_stack;
    }
    return err_has_stack(err) ? ''+err.stack : ''+err;
};

E.on_exception = undefined;
var in_exception;
E.set_exception_handler = function(prefix, err_func){
    E.on_exception = function(err){
        if (!(err instanceof TypeError || err instanceof ReferenceError) ||
            err.sent_perr)
        {
            return;
        }
        if (in_exception)
            return;
        in_exception = 1;
        err.sent_perr = true;
        // XXX amir: better not to get a prefix arg, it can be added by the
        // err_func
        err_func((prefix ? prefix+'_' : '')+'etask_typeerror', null, err);
        in_exception = 0;
    };
};

E.on_unhandled_exception = undefined;
E.catch_unhandled_exception = function(func, obj){
    return function(){
        var args = arguments;
        try { return func.apply(obj, Array.from(args)); }
        catch(e){ E.on_unhandled_exception(e); }
    };
};

if (is_node)
{ // zerr-node
E.ZEXIT_LOG_DIR = '/tmp/zexit_logs';
E.prefix = '';

E.level = L.NOTICE;
E.set_level = function(level){
    var prev = 'L'+LINV[E.level];
    level = level||env.ZERR;
    if (!level)
        return prev;
    var val = L[level] || L[level.replace(/^L/, '')];
    if (val!==undefined)
        E.level = val;
    return prev;
};

E.flush = function(){};
E.set_log_buffer = function(on){
    if (!on)
    {
        if (E.log_buffer)
        {
            E.flush();
            E.log_buffer(0);
        }
        return;
    }
    E.log_buffer = require('log-buffer');
    E.log_buffer(32*1024);
    E.flush = function(){ E.log_buffer.flush(); };
    setInterval(E.flush, 1000).unref();
};
var node_init = function(){
    if (zutil.is_mocha())
        E.level = L.WARN;
    else
        E.prefix = !cluster.isMaster ? 'C'+cluster.worker.id+' ' : '';
};

var init = function(){
    if (is_node)
        node_init();
    E.set_level();
};
init();

var zerr_format = function(args){
    return args.length<=1 ? args[0] : sprintf.apply(null, args); };
var __zerr = function(level, args){
    var msg = zerr_format(args);
    var k = Object.keys(L);
    var prefix = E.hide_timestamp ? '' : E.prefix+date.to_sql_ms()+' ';
    console.error(prefix+k[level]+': '+msg);
};

E.set_logger = function(logger){
    __zerr = function(level, args){
        var msg = zerr_format(args);
        logger(level, msg);
    };
};

_zerr = function(level, args){
    if (level>E.level)
        return;
    __zerr(level, args);
};
E._zerr = _zerr;

E.zexit = function(args){
    var stack;
    if (err_has_stack(args))
    {
        stack = args.stack;
        __zerr(L.CRIT, [E.e2s(args)]);
    }
    else
    {
        var e = new Error();
        stack = e.stack;
        __zerr(L.CRIT, arguments);
        console.error(stack);
    }
    E.flush();
    if (zutil.is_mocha())
    {
        /*jslint -W087*/
        debugger;
        process.exit(1);
    }
    var zcounter_file = require('./zcounter_file.js');
    zcounter_file.inc('server_zexit');
    args = zerr_format(arguments);
    write_zexit_log({id: 'server_zexit', info: ''+args, ts: date.to_sql(),
        backtrace: stack, version: version});
    E.flush();
    debugger;
    process.exit(1);
};

var write_zexit_log = function(json){
    try {
        var file = require('./file.js');
        file.write_e(E.ZEXIT_LOG_DIR+'/'+date.to_log_file()+'_zexit_'+
            process.pid+'.log', E.json(json), {mkdirp: 1});
    } catch(e){ E.zerr(E.e2s(e)); }
};
}
else
{ // browser-zerr
var chrome = self.chrome;
E.conf = self.conf;
E.log = [];
var L_STR = E.L_STR = ['EMERGENCY', 'ALERT', 'CRITICAL', 'ERROR', 'WARNING',
    'NOTICE', 'INFO', 'DEBUG'];
E.level = self.is_tpopup ? L.CRITICAL : E.conf && E.conf.zerr_level ?
    L[self.conf.zerr_level] : L.WARN;
E.log.max_size = 200;

var console_method = function(l){
    return l<=L.ERR ? 'error' : !chrome ? 'log' : l===L.WARN ? 'warn' :
        l<=L.INFO ? 'info' : 'debug';
};

_zerr = function(l, args){
    var s;
    try {
        var fmt = ''+args[0];
        var fmt_args = Array.prototype.slice.call(args, 1);
        /* XXX arik/bahaa HACK: use sprintf (note, console % options are
         * differnt than sprintf % options) */
        s = (fmt+(fmt_args.length ? ' '+E.json(fmt_args) : ''))
        .substr(0, 1024);
        var prefix = date.to_sql_ms()+' '+L_STR[l]+': ';
        E.log.push(prefix+s);
        if (E.is(l))
        {
            Function.prototype.apply.bind(console[console_method(l)],
                console)([prefix+fmt].concat(fmt_args));
        }
        if (E.log.length>E.log.max_size)
            E.log.splice(0, E.log.length - E.log.max_size/2);
    } catch(err){
        try { console.error('ERROR in zerr '+(err.stack||err), arguments); }
        catch(e){}
    }
    if (l<=L.CRIT)
        throw new Error(s);
};
E._zerr = _zerr;

var post = function(url, data){
    var use_xdr = typeof XDomainRequest=='function' &&
        !('withCredentials' in XMLHttpRequest.prototype);
    var req = use_xdr ? new XDomainRequest() : new XMLHttpRequest();
    req.open('POST', url);
    if (req.setRequestHeader)
    {
        req.setRequestHeader('Content-Type',
            'application/x-www-form-urlencoded; charset=UTF-8');
    }
    req.send(zescape.qs(data));
};
var perr_transport = function(id, info, opt){
    opt = zutil.clone(opt||{});
    var qs = opt.qs||{}, data = opt.data||{};
    data.is_json = 1;
    if (info && typeof info!='string')
        info = zerr.json(info);
    if (opt.err && !info)
        info = ''+(opt.err.message||zerr.json(opt.err));
    data.info = info;
    qs.id = id;
    if (!opt.no_zerr)
    {
        zerr._zerr(opt.level, ['perr '+id+(info ? ' info: '+info : '')+
            (opt.bt ? '\n'+opt.bt : '')]);
    }
    return post(zescape.uri(E.conf.url_perr+'/perr', qs), data);
};

var perr = function(perr_orig, pending){
    while (pending.length)
        perr_transport.apply(null, pending.shift());
    // set the zerr.perr stub to send to the clog server
    return perr_transport;
};
E.perr_install(perr);

} // end of browser-zerr}

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 679:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){

var is_node_ff = typeof module=='object' && module.exports;
if (!is_node_ff)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = sprintf;
E.sprintf = sprintf;
var has = Object.prototype.hasOwnProperty;
function sprintf(fmt /* args... */){
    if (has.call(E.cache, fmt))
        return E.cache[fmt](arguments);
    E.cache[fmt] = E.parse(fmt);
    E.cache_n++;
    if (E.cache_cb)
        E.cache_cb(fmt);
    return E.cache[fmt](arguments);
}
E.cache = {};
E.cache_n = 0;
E.to_int = function(num){
    return (num = +num)>=0 ? Math.floor(num) : -Math.floor(-num); };
E.thousand_grouping = function(num_s){
    var m = /^([-+])?(\d*)(\.\d*)?$/.exec(num_s);
    if (!m)
        return num_s;
    m[2] = (m[2]||'').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1'+',');
    return (m[1]||'')+m[2]+(m[3]||'');
};

E.parse_fast = function(fmt){
    var _fmt = fmt, match = [], arg_names = 0, cursor = 1;
    var pad_chr, pad_chrs, arg_padded, f, s = JSON.stringify;
    f = 'var out = "", arg, arg_s, sign;\n';
    for (; _fmt; _fmt = _fmt.substring(match[0].length))
    {
	if (match = /^[^%]+/.exec(_fmt))
	    f += 'out += '+s(match[0])+';\n';
	else if (match = /^%%/.exec(_fmt))
	    f += 'out += "%";\n';
	else if ((match =
	    /^%(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?(')?([bcdefoOsuxX])/
	    .exec(_fmt)))
	{
	    var positional = match[1], keyword = match[2], sign = match[3];
	    var pad_zero = match[4], pad_min = match[5], pad_max = match[6];
            var precision = match[7], thousand_grouping = match[8]=="'";
            var conversion = match[9], keyword_list = [];
	    if (keyword)
	    {
		arg_names |= 1;
		var _keyword = keyword, kmatch;
		if (!(kmatch = /^([a-z_][a-z_\d]*)/i.exec(_keyword)))
		    throw 'sprintf: invalid keyword property name '+_keyword;
		keyword_list.push(kmatch[1]);
		while (_keyword = _keyword.substring(kmatch[0].length))
		{
		    if (kmatch = /^\.([a-z_][a-z_\d]*)/i.exec(_keyword))
			keyword_list.push(kmatch[1]);
		    else if (kmatch = /^\[(\d+)\]/.exec(_keyword))
			keyword_list.push(kmatch[1]);
		    else
			throw 'sprintf: invalid keyword format '+_keyword;
		}
	    }
	    else
		arg_names |= 2;
	    if (arg_names===3)
	    {
		throw 'sprintf: mixing positional and named placeholders is '
		    +'not (yet) supported';
	    }
            f += 'sign = false;\n';
	    if (keyword_list.length) // keyword argument
	    {
		f += 'arg = argv['+cursor+']';
		for (var k = 0; k < keyword_list.length; k++)
		    f += '['+s(keyword_list[k])+']';
		f += ';\n';
	    }
	    else if (positional) // positional argument (explicit)
		f += 'arg = argv['+positional+'];\n';
	    else // positional argument (implicit)
		f += 'arg = argv['+(cursor++)+'];\n';
	    if (/[^sO]/.test(conversion))
		f += 'arg = +arg;\n';
	    switch (conversion)
	    {
	    case 'b': f += 'arg_s = arg.toString(2);\n'; break;
	    case 'c': f += 'arg_s = String.fromCharCode(arg);\n'; break;
            case 'd':
                f += 'arg = sprintf.to_int(arg); arg_s = ""+arg;\n';
                if (thousand_grouping)
                    f += 'arg_s = sprintf.thousand_grouping(arg_s);\n';
                break;
	    case 'e':
	        f += 'arg_s = arg.toExponential('
		+(precision ? s(precision) : '')+');\n';
	        break;
	    case 'f':
		if (precision)
		    f += 'arg_s = arg.toFixed('+precision+');\n';
		else
                    f += 'arg_s = ""+arg;\n';
                if (thousand_grouping)
                    f += 'arg_s = sprintf.thousand_grouping(arg_s);\n';
		break;
	    case 'o': f += 'arg_s = arg.toString(8);\n'; break;
	    case 'O': f += 'arg_s = JSON.stringify(arg);\n'; break;
            case 'u': f += 'arg = arg >>> 0; arg_s = ""+arg;\n'; break;
	    case 'x': f += 'arg_s = arg.toString(16);\n'; break;
	    case 'X': f += 'arg_s = arg.toString(16).toUpperCase();\n'; break;
	    case 's':
	        f += 'arg_s = ""+arg;\n';
		if (precision)
                    f += 'arg_s = arg_s.substring(0, '+precision+');\n';
	        break;
	    }
	    if (/[def]/.test(conversion))
            {
                if (sign)
                    f += 'if (arg>=0) arg_s = "+"+arg_s;\n';
                f += 'sign = arg_s[0]=="-" || arg_s[0]=="+";\n';
            }
	    pad_chr = !pad_zero ? ' ' : pad_zero=='0' ? '0' : pad_zero[1];
	    pad_chrs = s(pad_chr)
                +'.repeat(Math.max('+(+pad_max)+'-arg_s.length, 0))';
	    arg_padded = !pad_max ? 'arg_s' :
	        pad_min ? 'arg_s+'+pad_chrs :
                /[def]/.test(conversion) && pad_chr=='0' ?
                '(sign ? arg_s[0]+'+pad_chrs+'+arg_s.slice(1) : '
                +pad_chrs+'+arg_s)' :
                pad_chrs+'+arg_s';
	    f += 'out += '+arg_padded+';\n';
	}
	else
	    throw 'sprintf invalid format '+_fmt;
    }
    f += 'return out;\n';
    return new Function(['sprintf', 'argv'], f).bind(null, sprintf);
};

// slow version for Firefox extention where new Function() is not allowed
E.parse_slow = function(fmt){
    var _fmt = fmt, match = [], arg_names = 0, cursor = 1;
    var _f = [], out, arg, arg_s, argv, sign;
    function f(fn){ _f.push(fn); }
    for (; _fmt; _fmt = _fmt.substring(match[0].length))
    (function(){
	if (match = /^[^%]+/.exec(_fmt))
        {
            var _match = match;
	    f(function(){ return out += _match[0]; });
        }
	else if (match = /^%%/.exec(_fmt))
	    f(function(){ return out += '%'; });
	else if ((match =
	    /^%(?:([1-9]\d*)\$|\(([^\)]+)\))?(\+)?(0|'[^$])?(-)?(\d+)?(?:\.(\d+))?(')?([bcdefoOsuxX])/
	    .exec(_fmt)))
	{
	    var positional = match[1], keyword = match[2], sign = match[3];
	    var pad_zero = match[4], pad_min = match[5], pad_max = match[6];
            var precision = match[7], thousand_grouping = match[8]=="'";
            var conversion = match[9], keyword_list = [], _cursor = cursor;
	    if (keyword)
	    {
		arg_names |= 1;
		var _keyword = keyword, kmatch;
		if (!(kmatch = /^([a-z_][a-z_\d]*)/i.exec(_keyword)))
		    throw 'sprintf: invalid keyword property name '+_keyword;
		keyword_list.push(kmatch[1]);
		while (_keyword = _keyword.substring(kmatch[0].length))
		{
		    if (kmatch = /^\.([a-z_][a-z_\d]*)/i.exec(_keyword))
			keyword_list.push(kmatch[1]);
		    else if (kmatch = /^\[(\d+)\]/.exec(_keyword))
			keyword_list.push(kmatch[1]);
		    else
			throw 'sprintf: invalid keyword format '+_keyword;
		}
	    }
	    else
		arg_names |= 2;
	    if (arg_names===3)
	    {
		throw 'sprintf: mixing positional and named placeholders is '
		    +'not (yet) supported';
	    }
            f(function(){ sign = false; });
	    if (keyword_list.length) // keyword argument
	    {
		f(function(){
                    arg = argv[_cursor];
                    for (var k = 0; k < keyword_list.length && arg!=null; k++)
                        arg = arg[keyword_list[k]];
                });
	    }
	    else if (positional) // positional argument (explicit)
		f(function(){ arg = argv[positional]; });
	    else // positional argument (implicit)
            {
		f(function(){ arg = argv[_cursor]; });
                cursor++;
            }
	    if (/[^sO]/.test(conversion))
		f(function(){ return arg = +arg; });
	    switch (conversion)
	    {
	    case 'b': f(function(){ arg_s = arg.toString(2); }); break;
	    case 'c':
                  f(function(){ arg_s = String.fromCharCode(arg); });
                  break;
            case 'd':
                f(function(){ arg = sprintf.to_int(arg); arg_s = ''+arg; });
                if (thousand_grouping)
                    f(function(){ arg_s = sprintf.thousand_grouping(arg_s); });
                break;
	    case 'e':
	        f(function(){ arg_s = arg.toExponential(
                    precision ? precision : undefined); });
	        break;
	    case 'f':
		if (precision)
		    f(function(){ arg_s = arg.toFixed(precision); });
		else
                    f(function(){ arg_s = ''+arg; });
                if (thousand_grouping)
                    f(function(){ arg_s = sprintf.thousand_grouping(arg_s); });
		break;
	    case 'o': f(function(){ arg_s = arg.toString(8); }); break;
	    case 'O': f(function(){ arg_s = JSON.stringify(arg); }); break;
            case 'u': f(function(){ arg = arg >>> 0; arg_s = ''+arg; }); break;
	    case 'x': f(function(){ arg_s = arg.toString(16); }); break;
	    case 'X':
                f(function(){ arg_s = arg.toString(16).toUpperCase(); });
                break;
	    case 's':
	        f(function(){ arg_s = ''+arg; });
		if (precision)
                    f(function(){ arg_s = arg_s.substring(0, precision); });
	        break;
	    }
	    if (/[def]/.test(conversion))
            {
                if (sign)
                    f(function(){ if (arg>=0) arg_s = '+'+arg_s; });
                f(function(){ sign = arg_s[0]=='-' || arg_s[0]=='+'; });
            }
	    var pad_chr = !pad_zero ? ' ' : pad_zero=='0' ? '0' : pad_zero[1];
	    f(function(){
                var pad_chrs = pad_chr.repeat(
                    Math.max(+pad_max-arg_s.length, 0));
                var arg_padded = !pad_max ? arg_s :
                    pad_min ? arg_s+pad_chrs :
                    sign && pad_chr[0]=='0' ?
                    arg_s[0]+pad_chrs+arg_s.slice(1) :
                    pad_chrs+arg_s;
                out += arg_padded;
            });
	}
	else
	    throw 'sprintf invalid format '+_fmt;
    })();
    return function(_argv){
        argv = _argv;
        out = '';
        for (var i=0; i<_f.length; i++)
            _f[i](argv);
        return out;
    };
};
E.parse = (function(){
    try {
        if ((new Function('return 1')())==1)
            return E.parse_fast;
    } catch(e){}
    return E.parse_slow; // capp does not support new Function()
})();

E.vsprintf = function(fmt, argv, opt){
    if (opt)
    {
        if (opt.fast)
            return E.parse_fast(fmt)([fmt].concat(argv));
        if (opt.slow)
            return E.parse_slow(fmt)([fmt].concat(argv));
    }
    return E.sprintf.apply(null, [fmt].concat(argv)); };

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 680:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;
var module;
// LICENSE_CODE ZON ISC
'use strict'; /*zlint node, br*/
(function(){

var is_node = typeof module=='object' && module.exports && module.children;
if (!is_node)
    ;
else
    ;
!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_RESULT__ = function(){
var E = rate_limit;

function rate_limit(rl, ms, n){
    var now = Date.now();
    if (!rl.count || rl.ts+ms<now)
    {
        rl.count = 1;
        rl.ts = now;
        return true;
    }
    rl.count++;
    return rl.count<=n;
}

E.leaky_bucket = function leaky_bucket(size, rate){
    this.size = size;
    this.rate = rate;
    this.time = Date.now();
    this.level = 0;
};

E.leaky_bucket.prototype.inc = function(inc){
    if (inc===undefined)
	inc = 1;
    var now = Date.now();
    this.level -= this.rate * (now - this.time);
    this.time = now;
    if (this.level<0)
	this.level = 0;
    var new_level = this.level + inc;
    if (new_level>this.size)
	return false;
    this.level = new_level;
    return true;
};

return E; }.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__)); }());


/***/ }),

/***/ 681:
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ 682:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(683);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(57)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../css-loader/index.js!./prism.css", function() {
			var newContent = require("!!../../css-loader/index.js!./prism.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 683:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(56)(undefined);
// imports


// module
exports.push([module.i, "/**\n * prism.js default theme for JavaScript, CSS and HTML\n * Based on dabblet (http://dabblet.com)\n * @author Lea Verou\n */\n\ncode[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tcolor: black;\n\tbackground: none;\n\ttext-shadow: 0 1px white;\n\tfont-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;\n\ttext-align: left;\n\twhite-space: pre;\n\tword-spacing: normal;\n\tword-break: normal;\n\tword-wrap: normal;\n\tline-height: 1.5;\n\n\t-moz-tab-size: 4;\n\t-o-tab-size: 4;\n\ttab-size: 4;\n\n\t-webkit-hyphens: none;\n\t-moz-hyphens: none;\n\t-ms-hyphens: none;\n\thyphens: none;\n}\n\npre[class*=\"language-\"]::-moz-selection, pre[class*=\"language-\"] ::-moz-selection,\ncode[class*=\"language-\"]::-moz-selection, code[class*=\"language-\"] ::-moz-selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\npre[class*=\"language-\"]::selection, pre[class*=\"language-\"] ::selection,\ncode[class*=\"language-\"]::selection, code[class*=\"language-\"] ::selection {\n\ttext-shadow: none;\n\tbackground: #b3d4fc;\n}\n\n@media print {\n\tcode[class*=\"language-\"],\n\tpre[class*=\"language-\"] {\n\t\ttext-shadow: none;\n\t}\n}\n\n/* Code blocks */\npre[class*=\"language-\"] {\n\tpadding: 1em;\n\tmargin: .5em 0;\n\toverflow: auto;\n}\n\n:not(pre) > code[class*=\"language-\"],\npre[class*=\"language-\"] {\n\tbackground: #f5f2f0;\n}\n\n/* Inline code */\n:not(pre) > code[class*=\"language-\"] {\n\tpadding: .1em;\n\tborder-radius: .3em;\n\twhite-space: normal;\n}\n\n.token.comment,\n.token.prolog,\n.token.doctype,\n.token.cdata {\n\tcolor: slategray;\n}\n\n.token.punctuation {\n\tcolor: #999;\n}\n\n.namespace {\n\topacity: .7;\n}\n\n.token.property,\n.token.tag,\n.token.boolean,\n.token.number,\n.token.constant,\n.token.symbol,\n.token.deleted {\n\tcolor: #905;\n}\n\n.token.selector,\n.token.attr-name,\n.token.string,\n.token.char,\n.token.builtin,\n.token.inserted {\n\tcolor: #690;\n}\n\n.token.operator,\n.token.entity,\n.token.url,\n.language-css .token.string,\n.style .token.string {\n\tcolor: #a67f59;\n\tbackground: hsla(0, 0%, 100%, .5);\n}\n\n.token.atrule,\n.token.attr-value,\n.token.keyword {\n\tcolor: #07a;\n}\n\n.token.function {\n\tcolor: #DD4A68;\n}\n\n.token.regex,\n.token.important,\n.token.variable {\n\tcolor: #e90;\n}\n\n.token.important,\n.token.bold {\n\tfont-weight: bold;\n}\n.token.italic {\n\tfont-style: italic;\n}\n\n.token.entity {\n\tcursor: help;\n}\n", ""]);

// exports


/***/ }),

/***/ 684:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {
/* **********************************************
     Begin prism-core.js
********************************************** */

var _self = (typeof window !== 'undefined')
	? window   // if in browser
	: (
		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
		? self // if in worker
		: {}   // if in node js
	);

/**
 * Prism: Lightweight, robust, elegant syntax highlighting
 * MIT license http://www.opensource.org/licenses/mit-license.php/
 * @author Lea Verou http://lea.verou.me
 */

var Prism = (function(){

// Private helper vars
var lang = /\blang(?:uage)?-(\w+)\b/i;
var uniqueId = 0;

var _ = _self.Prism = {
	manual: _self.Prism && _self.Prism.manual,
	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,
	util: {
		encode: function (tokens) {
			if (tokens instanceof Token) {
				return new Token(tokens.type, _.util.encode(tokens.content), tokens.alias);
			} else if (_.util.type(tokens) === 'Array') {
				return tokens.map(_.util.encode);
			} else {
				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
			}
		},

		type: function (o) {
			return Object.prototype.toString.call(o).match(/\[object (\w+)\]/)[1];
		},

		objId: function (obj) {
			if (!obj['__id']) {
				Object.defineProperty(obj, '__id', { value: ++uniqueId });
			}
			return obj['__id'];
		},

		// Deep clone a language definition (e.g. to extend it)
		clone: function (o) {
			var type = _.util.type(o);

			switch (type) {
				case 'Object':
					var clone = {};

					for (var key in o) {
						if (o.hasOwnProperty(key)) {
							clone[key] = _.util.clone(o[key]);
						}
					}

					return clone;

				case 'Array':
					return o.map(function(v) { return _.util.clone(v); });
			}

			return o;
		}
	},

	languages: {
		extend: function (id, redef) {
			var lang = _.util.clone(_.languages[id]);

			for (var key in redef) {
				lang[key] = redef[key];
			}

			return lang;
		},

		/**
		 * Insert a token before another token in a language literal
		 * As this needs to recreate the object (we cannot actually insert before keys in object literals),
		 * we cannot just provide an object, we need anobject and a key.
		 * @param inside The key (or language id) of the parent
		 * @param before The key to insert before. If not provided, the function appends instead.
		 * @param insert Object with the key/value pairs to insert
		 * @param root The object that contains `inside`. If equal to Prism.languages, it can be omitted.
		 */
		insertBefore: function (inside, before, insert, root) {
			root = root || _.languages;
			var grammar = root[inside];

			if (arguments.length == 2) {
				insert = arguments[1];

				for (var newToken in insert) {
					if (insert.hasOwnProperty(newToken)) {
						grammar[newToken] = insert[newToken];
					}
				}

				return grammar;
			}

			var ret = {};

			for (var token in grammar) {

				if (grammar.hasOwnProperty(token)) {

					if (token == before) {

						for (var newToken in insert) {

							if (insert.hasOwnProperty(newToken)) {
								ret[newToken] = insert[newToken];
							}
						}
					}

					ret[token] = grammar[token];
				}
			}

			// Update references in other language definitions
			_.languages.DFS(_.languages, function(key, value) {
				if (value === root[inside] && key != inside) {
					this[key] = ret;
				}
			});

			return root[inside] = ret;
		},

		// Traverse a language definition with Depth First Search
		DFS: function(o, callback, type, visited) {
			visited = visited || {};
			for (var i in o) {
				if (o.hasOwnProperty(i)) {
					callback.call(o, i, o[i], type || i);

					if (_.util.type(o[i]) === 'Object' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, null, visited);
					}
					else if (_.util.type(o[i]) === 'Array' && !visited[_.util.objId(o[i])]) {
						visited[_.util.objId(o[i])] = true;
						_.languages.DFS(o[i], callback, i, visited);
					}
				}
			}
		}
	},
	plugins: {},

	highlightAll: function(async, callback) {
		var env = {
			callback: callback,
			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
		};

		_.hooks.run("before-highlightall", env);

		var elements = env.elements || document.querySelectorAll(env.selector);

		for (var i=0, element; element = elements[i++];) {
			_.highlightElement(element, async === true, env.callback);
		}
	},

	highlightElement: function(element, async, callback) {
		// Find language
		var language, grammar, parent = element;

		while (parent && !lang.test(parent.className)) {
			parent = parent.parentNode;
		}

		if (parent) {
			language = (parent.className.match(lang) || [,''])[1].toLowerCase();
			grammar = _.languages[language];
		}

		// Set language on the element, if not present
		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

		if (element.parentNode) {
			// Set language on the parent, for styling
			parent = element.parentNode;

			if (/pre/i.test(parent.nodeName)) {
				parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
			}
		}

		var code = element.textContent;

		var env = {
			element: element,
			language: language,
			grammar: grammar,
			code: code
		};

		_.hooks.run('before-sanity-check', env);

		if (!env.code || !env.grammar) {
			if (env.code) {
				_.hooks.run('before-highlight', env);
				env.element.textContent = env.code;
				_.hooks.run('after-highlight', env);
			}
			_.hooks.run('complete', env);
			return;
		}

		_.hooks.run('before-highlight', env);

		if (async && _self.Worker) {
			var worker = new Worker(_.filename);

			worker.onmessage = function(evt) {
				env.highlightedCode = evt.data;

				_.hooks.run('before-insert', env);

				env.element.innerHTML = env.highlightedCode;

				callback && callback.call(env.element);
				_.hooks.run('after-highlight', env);
				_.hooks.run('complete', env);
			};

			worker.postMessage(JSON.stringify({
				language: env.language,
				code: env.code,
				immediateClose: true
			}));
		}
		else {
			env.highlightedCode = _.highlight(env.code, env.grammar, env.language);

			_.hooks.run('before-insert', env);

			env.element.innerHTML = env.highlightedCode;

			callback && callback.call(element);

			_.hooks.run('after-highlight', env);
			_.hooks.run('complete', env);
		}
	},

	highlight: function (text, grammar, language) {
		var tokens = _.tokenize(text, grammar);
		return Token.stringify(_.util.encode(tokens), language);
	},

	matchGrammar: function (text, strarr, grammar, index, startPos, oneshot, target) {
		var Token = _.Token;

		for (var token in grammar) {
			if(!grammar.hasOwnProperty(token) || !grammar[token]) {
				continue;
			}

			if (token == target) {
				return;
			}

			var patterns = grammar[token];
			patterns = (_.util.type(patterns) === "Array") ? patterns : [patterns];

			for (var j = 0; j < patterns.length; ++j) {
				var pattern = patterns[j],
					inside = pattern.inside,
					lookbehind = !!pattern.lookbehind,
					greedy = !!pattern.greedy,
					lookbehindLength = 0,
					alias = pattern.alias;

				if (greedy && !pattern.pattern.global) {
					// Without the global flag, lastIndex won't work
					var flags = pattern.pattern.toString().match(/[imuy]*$/)[0];
					pattern.pattern = RegExp(pattern.pattern.source, flags + "g");
				}

				pattern = pattern.pattern || pattern;

				// Don’t cache length as it changes during the loop
				for (var i = index, pos = startPos; i < strarr.length; pos += strarr[i].length, ++i) {

					var str = strarr[i];

					if (strarr.length > text.length) {
						// Something went terribly wrong, ABORT, ABORT!
						return;
					}

					if (str instanceof Token) {
						continue;
					}

					pattern.lastIndex = 0;

					var match = pattern.exec(str),
					    delNum = 1;

					// Greedy patterns can override/remove up to two previously matched tokens
					if (!match && greedy && i != strarr.length - 1) {
						pattern.lastIndex = pos;
						match = pattern.exec(text);
						if (!match) {
							break;
						}

						var from = match.index + (lookbehind ? match[1].length : 0),
						    to = match.index + match[0].length,
						    k = i,
						    p = pos;

						for (var len = strarr.length; k < len && (p < to || (!strarr[k].type && !strarr[k - 1].greedy)); ++k) {
							p += strarr[k].length;
							// Move the index i to the element in strarr that is closest to from
							if (from >= p) {
								++i;
								pos = p;
							}
						}

						/*
						 * If strarr[i] is a Token, then the match starts inside another Token, which is invalid
						 * If strarr[k - 1] is greedy we are in conflict with another greedy pattern
						 */
						if (strarr[i] instanceof Token || strarr[k - 1].greedy) {
							continue;
						}

						// Number of tokens to delete and replace with the new match
						delNum = k - i;
						str = text.slice(pos, p);
						match.index -= pos;
					}

					if (!match) {
						if (oneshot) {
							break;
						}

						continue;
					}

					if(lookbehind) {
						lookbehindLength = match[1].length;
					}

					var from = match.index + lookbehindLength,
					    match = match[0].slice(lookbehindLength),
					    to = from + match.length,
					    before = str.slice(0, from),
					    after = str.slice(to);

					var args = [i, delNum];

					if (before) {
						++i;
						pos += before.length;
						args.push(before);
					}

					var wrapped = new Token(token, inside? _.tokenize(match, inside) : match, alias, match, greedy);

					args.push(wrapped);

					if (after) {
						args.push(after);
					}

					Array.prototype.splice.apply(strarr, args);

					if (delNum != 1)
						_.matchGrammar(text, strarr, grammar, i, pos, true, token);

					if (oneshot)
						break;
				}
			}
		}
	},

	tokenize: function(text, grammar, language) {
		var strarr = [text];

		var rest = grammar.rest;

		if (rest) {
			for (var token in rest) {
				grammar[token] = rest[token];
			}

			delete grammar.rest;
		}

		_.matchGrammar(text, strarr, grammar, 0, 0, false);

		return strarr;
	},

	hooks: {
		all: {},

		add: function (name, callback) {
			var hooks = _.hooks.all;

			hooks[name] = hooks[name] || [];

			hooks[name].push(callback);
		},

		run: function (name, env) {
			var callbacks = _.hooks.all[name];

			if (!callbacks || !callbacks.length) {
				return;
			}

			for (var i=0, callback; callback = callbacks[i++];) {
				callback(env);
			}
		}
	}
};

var Token = _.Token = function(type, content, alias, matchedStr, greedy) {
	this.type = type;
	this.content = content;
	this.alias = alias;
	// Copy of the full string this token was created from
	this.length = (matchedStr || "").length|0;
	this.greedy = !!greedy;
};

Token.stringify = function(o, language, parent) {
	if (typeof o == 'string') {
		return o;
	}

	if (_.util.type(o) === 'Array') {
		return o.map(function(element) {
			return Token.stringify(element, language, o);
		}).join('');
	}

	var env = {
		type: o.type,
		content: Token.stringify(o.content, language, parent),
		tag: 'span',
		classes: ['token', o.type],
		attributes: {},
		language: language,
		parent: parent
	};

	if (o.alias) {
		var aliases = _.util.type(o.alias) === 'Array' ? o.alias : [o.alias];
		Array.prototype.push.apply(env.classes, aliases);
	}

	_.hooks.run('wrap', env);

	var attributes = Object.keys(env.attributes).map(function(name) {
		return name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
	}).join(' ');

	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + (attributes ? ' ' + attributes : '') + '>' + env.content + '</' + env.tag + '>';

};

if (!_self.document) {
	if (!_self.addEventListener) {
		// in Node.js
		return _self.Prism;
	}

	if (!_.disableWorkerMessageHandler) {
		// In worker
		_self.addEventListener('message', function (evt) {
			var message = JSON.parse(evt.data),
				lang = message.language,
				code = message.code,
				immediateClose = message.immediateClose;

			_self.postMessage(_.highlight(code, _.languages[lang], lang));
			if (immediateClose) {
				_self.close();
			}
		}, false);
	}

	return _self.Prism;
}

//Get current script and highlight
var script = document.currentScript || [].slice.call(document.getElementsByTagName("script")).pop();

if (script) {
	_.filename = script.src;

	if (!_.manual && !script.hasAttribute('data-manual')) {
		if(document.readyState !== "loading") {
			if (window.requestAnimationFrame) {
				window.requestAnimationFrame(_.highlightAll);
			} else {
				window.setTimeout(_.highlightAll, 16);
			}
		}
		else {
			document.addEventListener('DOMContentLoaded', _.highlightAll);
		}
	}
}

return _self.Prism;

})();

if (typeof module !== 'undefined' && module.exports) {
	module.exports = Prism;
}

// hack for components to work correctly in node.js
if (typeof global !== 'undefined') {
	global.Prism = Prism;
}


/* **********************************************
     Begin prism-markup.js
********************************************** */

Prism.languages.markup = {
	'comment': /<!--[\s\S]*?-->/,
	'prolog': /<\?[\s\S]+?\?>/,
	'doctype': /<!DOCTYPE[\s\S]+?>/i,
	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
	'tag': {
		pattern: /<\/?(?!\d)[^\s>\/=$<]+(?:\s+[^\s>\/=]+(?:=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+))?)*\s*\/?>/i,
		inside: {
			'tag': {
				pattern: /^<\/?[^\s>\/]+/i,
				inside: {
					'punctuation': /^<\/?/,
					'namespace': /^[^\s>\/:]+:/
				}
			},
			'attr-value': {
				pattern: /=(?:("|')(?:\\[\s\S]|(?!\1)[^\\])*\1|[^\s'">=]+)/i,
				inside: {
					'punctuation': [
						/^=/,
						{
							pattern: /(^|[^\\])["']/,
							lookbehind: true
						}
					]
				}
			},
			'punctuation': /\/?>/,
			'attr-name': {
				pattern: /[^\s>\/]+/,
				inside: {
					'namespace': /^[^\s>\/:]+:/
				}
			}

		}
	},
	'entity': /&#?[\da-z]{1,8};/i
};

Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
	Prism.languages.markup['entity'];

// Plugin to make entity title show the real entity, idea by Roman Komarov
Prism.hooks.add('wrap', function(env) {

	if (env.type === 'entity') {
		env.attributes['title'] = env.content.replace(/&amp;/, '&');
	}
});

Prism.languages.xml = Prism.languages.markup;
Prism.languages.html = Prism.languages.markup;
Prism.languages.mathml = Prism.languages.markup;
Prism.languages.svg = Prism.languages.markup;


/* **********************************************
     Begin prism-css.js
********************************************** */

Prism.languages.css = {
	'comment': /\/\*[\s\S]*?\*\//,
	'atrule': {
		pattern: /@[\w-]+?.*?(?:;|(?=\s*\{))/i,
		inside: {
			'rule': /@[\w-]+/
			// See rest below
		}
	},
	'url': /url\((?:(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1|.*?)\)/i,
	'selector': /[^{}\s][^{};]*?(?=\s*\{)/,
	'string': {
		pattern: /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'property': /[\w-]+(?=\s*:)/i,
	'important': /\B!important\b/i,
	'function': /[-a-z0-9]+(?=\()/i,
	'punctuation': /[(){};:]/
};

Prism.languages.css['atrule'].inside.rest = Prism.util.clone(Prism.languages.css);

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'style': {
			pattern: /(<style[\s\S]*?>)[\s\S]*?(?=<\/style>)/i,
			lookbehind: true,
			inside: Prism.languages.css,
			alias: 'language-css'
		}
	});
	
	Prism.languages.insertBefore('inside', 'attr-value', {
		'style-attr': {
			pattern: /\s*style=("|')(?:\\[\s\S]|(?!\1)[^\\])*\1/i,
			inside: {
				'attr-name': {
					pattern: /^\s*style/i,
					inside: Prism.languages.markup.tag.inside
				},
				'punctuation': /^\s*=\s*['"]|['"]\s*$/,
				'attr-value': {
					pattern: /.+/i,
					inside: Prism.languages.css
				}
			},
			alias: 'language-css'
		}
	}, Prism.languages.markup.tag);
}

/* **********************************************
     Begin prism-clike.js
********************************************** */

Prism.languages.clike = {
	'comment': [
		{
			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
			lookbehind: true
		},
		{
			pattern: /(^|[^\\:])\/\/.*/,
			lookbehind: true
		}
	],
	'string': {
		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
		greedy: true
	},
	'class-name': {
		pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
		lookbehind: true,
		inside: {
			punctuation: /[.\\]/
		}
	},
	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
	'boolean': /\b(?:true|false)\b/,
	'function': /[a-z0-9_]+(?=\()/i,
	'number': /\b-?(?:0x[\da-f]+|\d*\.?\d+(?:e[+-]?\d+)?)\b/i,
	'operator': /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
	'punctuation': /[{}[\];(),.:]/
};


/* **********************************************
     Begin prism-javascript.js
********************************************** */

Prism.languages.javascript = Prism.languages.extend('clike', {
	'keyword': /\b(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|var|void|while|with|yield)\b/,
	'number': /\b-?(?:0[xX][\dA-Fa-f]+|0[bB][01]+|0[oO][0-7]+|\d*\.?\d+(?:[Ee][+-]?\d+)?|NaN|Infinity)\b/,
	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
	'function': /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\s*\()/i,
	'operator': /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/
});

Prism.languages.insertBefore('javascript', 'keyword', {
	'regex': {
		pattern: /(^|[^/])\/(?!\/)(\[[^\]\r\n]+]|\\.|[^/\\\[\r\n])+\/[gimyu]{0,5}(?=\s*($|[\r\n,.;})]))/,
		lookbehind: true,
		greedy: true
	},
	// This must be declared before keyword because we use "function" inside the look-forward
	'function-variable': {
		pattern: /[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*(?=\s*=\s*(?:function\b|(?:\([^()]*\)|[_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)\s*=>))/i,
		alias: 'function'
	}
});

Prism.languages.insertBefore('javascript', 'string', {
	'template-string': {
		pattern: /`(?:\\[\s\S]|[^\\`])*`/,
		greedy: true,
		inside: {
			'interpolation': {
				pattern: /\$\{[^}]+\}/,
				inside: {
					'interpolation-punctuation': {
						pattern: /^\$\{|\}$/,
						alias: 'punctuation'
					},
					rest: Prism.languages.javascript
				}
			},
			'string': /[\s\S]+/
		}
	}
});

if (Prism.languages.markup) {
	Prism.languages.insertBefore('markup', 'tag', {
		'script': {
			pattern: /(<script[\s\S]*?>)[\s\S]*?(?=<\/script>)/i,
			lookbehind: true,
			inside: Prism.languages.javascript,
			alias: 'language-javascript'
		}
	});
}

Prism.languages.js = Prism.languages.javascript;


/* **********************************************
     Begin prism-file-highlight.js
********************************************** */

(function () {
	if (typeof self === 'undefined' || !self.Prism || !self.document || !document.querySelector) {
		return;
	}

	self.Prism.fileHighlight = function() {

		var Extensions = {
			'js': 'javascript',
			'py': 'python',
			'rb': 'ruby',
			'ps1': 'powershell',
			'psm1': 'powershell',
			'sh': 'bash',
			'bat': 'batch',
			'h': 'c',
			'tex': 'latex'
		};

		Array.prototype.slice.call(document.querySelectorAll('pre[data-src]')).forEach(function (pre) {
			var src = pre.getAttribute('data-src');

			var language, parent = pre;
			var lang = /\blang(?:uage)?-(?!\*)(\w+)\b/i;
			while (parent && !lang.test(parent.className)) {
				parent = parent.parentNode;
			}

			if (parent) {
				language = (pre.className.match(lang) || [, ''])[1];
			}

			if (!language) {
				var extension = (src.match(/\.(\w+)$/) || [, ''])[1];
				language = Extensions[extension] || extension;
			}

			var code = document.createElement('code');
			code.className = 'language-' + language;

			pre.textContent = '';

			code.textContent = 'Loading…';

			pre.appendChild(code);

			var xhr = new XMLHttpRequest();

			xhr.open('GET', src, true);

			xhr.onreadystatechange = function () {
				if (xhr.readyState == 4) {

					if (xhr.status < 400 && xhr.responseText) {
						code.textContent = xhr.responseText;

						Prism.highlightElement(code);
					}
					else if (xhr.status >= 400) {
						code.textContent = '✖ Error ' + xhr.status + ' while fetching file: ' + xhr.statusText;
					}
					else {
						code.textContent = '✖ Error: File does not exist or is empty';
					}
				}
			};

			xhr.send(null);
		});

	};

	document.addEventListener('DOMContentLoaded', self.Prism.fileHighlight);

})();

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(104)))

/***/ }),

/***/ 685:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _common = __webpack_require__(64);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var E = {};
var Li = function Li(props) {
    return _react2.default.createElement(
        'li',
        null,
        _react2.default.createElement(
            'div',
            { className: 'circle_wrapper' },
            _react2.default.createElement('div', { className: 'circle' })
        ),
        _react2.default.createElement(
            'div',
            { className: 'single_instruction' },
            props.children
        )
    );
};

E.code = function () {
    var proxy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 24000;
    return {
        shell: 'curl --proxy 127.0.0.1:' + proxy + ' "http://lumtest.com/myip.json"',
        node: '#!/usr/bin/env node\nrequire(\'request-promise\')({\n    url: \'http://lumtest.com/myip.json\',\n    proxy: \'http://127.0.0.1:' + proxy + '\'\n}).then(function(data){\n    console.log(data);\n}, function(err){\n    console.error(err);\n});',
        java: 'package example;\n\nimport org.apache.http.HttpHost;\nimport org.apache.http.client.fluent.*;\n\npublic class Example {\n    public static void main(String[] args) throws Exception {\n        HttpHost proxy = new HttpHost("127.0.0.1", ' + proxy + ');\n        String res = Executor.newInstance()\n            .execute(Request.Get("http://lumtest.com/myip.json")\n            .viaProxy(proxy))\n            .returnContent().asString();\n        System.out.println(res);\n    }\n}',
        csharp: 'using System;\nusing System.Net;\n\nclass Example\n{\n    static void Main()\n    {\n        var client = new WebClient();\n        client.Proxy = new WebProxy("127.0.0.1:' + proxy + '");\n        Console.WriteLine(client.DownloadString(\n            "http://lumtest.com/myip.json"));\n    }\n}',
        vb: 'Imports System.Net\n\nModule Example\n    Sub Main()\n        Dim Client As New WebClient\n        Client.Proxy = New WebProxy("http://127.0.0.1:' + proxy + '")\n        Console.WriteLine(Client.DownloadString(\n            "http://lumtest.com/myip.json"))\n    End Sub\nEnd Module',
        python: '#!/usr/bin/env python\nprint(\'If you get error "ImportError: No module named \\\'six\\\'"\'+\\\n    \'install six:\\n$ sudo pip install six\');\nimport sys\nif sys.version_info[0]==2:\n    import six\n    from six.moves.urllib import request\n    opener = request.build_opener(\n        request.ProxyHandler(\n            {\'http\': \'http://127.0.0.1:' + proxy + '\'}))\n    print(opener.open(\'http://lumtest.com/myip.json\').read())\nif sys.version_info[0]==3:\n    import urllib.request\n    opener = urllib.request.build_opener(\n        urllib.request.ProxyHandler(\n            {\'http\': \'http://127.0.0.1:' + proxy + '\'}))\n    print(opener.open(\'http://lumtest.com/myip.json\').read())',
        ruby: '#!/usr/bin/ruby\n\nrequire \'uri\'\nrequire \'net/http\'\n\nuri = URI.parse(\'{{example.user_url}}\')\nproxy = Net::HTTP::Proxy(\'127.0.0.1\', ' + proxy + ')\n\nreq = Net::HTTP::Get.new(uri.path)\n\nresult = proxy.start(uri.host,uri.port) do |http|\n    http.request(req)\nend\n\nputs result.body',
        php: '<?php\n    $curl = curl_init(\'http://lumtest.com/myip.json\');\n    curl_setopt($curl, CURLOPT_PROXY, \'http://127.0.0.1:' + proxy + '\');\n    curl_exec($curl);\n?>',
        perl: '#!/usr/bin/perl\nuse LWP::UserAgent;\nmy $agent = LWP::UserAgent->new();\n$agent->proxy([\'http\', \'https\'], "http://127.0.0.1:' + proxy + '");\nprint $agent->get(\'http://lumtest.com/myip.json\')->content();'
    };
};
E.browser = function () {
    var proxy = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 24000;
    return {
        chrome_win: _react2.default.createElement(
            'ol',
            null,
            _react2.default.createElement(
                Li,
                null,
                'Click the Chrome menu on the browser toolbar.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Select "Settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click "Advanced settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'In the "System" section, click "Open proxy settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click "LAN settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Select the "Use a proxy server for your LAN" check box under "Proxy Server".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Address":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    '127.0.0.1'
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Port":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    proxy
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Save changes by pressing "OK".'
            )
        ),
        chrome_mac: _react2.default.createElement(
            'ol',
            null,
            _react2.default.createElement(
                Li,
                null,
                'Click the Chrome menu on the browser toolbar.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Select "Settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click "Show advanced settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'In the "Network" section, click "Change proxy settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'System Preferences should start up automatically, with the Network window open and Proxies selected.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Choose "Web Proxy (HTTP)".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Web Proxy Server":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    '127.0.0.1'
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Port":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    proxy
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Save changes by pressing "OK".'
            )
        ),
        ie: _react2.default.createElement(
            'ol',
            null,
            _react2.default.createElement(
                Li,
                null,
                'Click the Tools button, and then click Internet options.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click the Connections tab.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click "LAN settings".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Select the "Use a proxy server for your LAN" check box.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Address":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    '127.0.0.1'
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Port":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    proxy
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Save changes by pressing "OK".'
            )
        ),
        firefox: _react2.default.createElement(
            'ol',
            null,
            _react2.default.createElement(
                Li,
                null,
                'In main menu, click "Tools" and then click "Options".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click the "General" tab and scroll down to "Network Proxy".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Open network settings by clicking "Settings..." button.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Choose "Manual proxy configuration" radio button.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "HTTP Proxy":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    '127.0.0.1'
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Port":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    proxy
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Tick "Use this proxy server for all protocols" checkbox.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Save changes by pressing "OK".'
            )
        ),
        safari: _react2.default.createElement(
            'ol',
            null,
            _react2.default.createElement(
                Li,
                null,
                'Pull down the Safari menu and select "Preferences".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Click on the "Advanced" icon.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'In the "Proxies" option, click on Change Settings.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'System Preferences should start up automatically, with the Network window open and Proxies selected.'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Choose "Web Proxy (HTTP)".'
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Web Proxy Server":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    '127.0.0.1'
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Enter "Port":',
                _react2.default.createElement(
                    _common.Code,
                    { id: 'address' },
                    proxy
                )
            ),
            _react2.default.createElement(
                Li,
                null,
                'Save changes by pressing "OK".'
            )
        )
    };
};

exports.default = E;

/***/ }),

/***/ 686:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _jquery = __webpack_require__(21);

var _jquery2 = _interopRequireDefault(_jquery);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var AddProxy = function (_React$Component) {
  _inherits(AddProxy, _React$Component);

  function AddProxy() {
    _classCallCheck(this, AddProxy);

    return _possibleConstructorReturn(this, (AddProxy.__proto__ || Object.getPrototypeOf(AddProxy)).apply(this, arguments));
  }

  _createClass(AddProxy, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'lpm' },
        _react2.default.createElement(
          Modal,
          { id: 'add_proxy_modal', title: 'Add new proxy' },
          _react2.default.createElement(
            'div',
            { className: 'section' },
            _react2.default.createElement('div', { className: 'icon zone_icon' }),
            _react2.default.createElement(
              'h4',
              null,
              'Choose Zone'
            ),
            _react2.default.createElement(
              'select',
              null,
              _react2.default.createElement(
                'option',
                { value: '1' },
                'Default (static)'
              ),
              _react2.default.createElement(
                'option',
                { value: '2' },
                'gen'
              ),
              _react2.default.createElement(
                'option',
                { value: '3' },
                'this is example'
              ),
              _react2.default.createElement(
                'option',
                { value: '4' },
                'residential'
              )
            )
          ),
          _react2.default.createElement(
            'div',
            { className: 'section' },
            _react2.default.createElement('div', { className: 'icon preset_icon' }),
            _react2.default.createElement(
              'h4',
              null,
              'Select preset configuration'
            ),
            _react2.default.createElement(
              'select',
              null,
              _react2.default.createElement(
                'option',
                { value: '1' },
                'Long session (keep session alive)'
              ),
              _react2.default.createElement(
                'option',
                { value: '2' },
                'this is example'
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'preview' },
              _react2.default.createElement(
                'div',
                { className: 'header' },
                'Long session \u2013 keep session alive'
              ),
              _react2.default.createElement(
                'div',
                { className: 'desc' },
                'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in'
              ),
              _react2.default.createElement(
                'ul',
                null,
                _react2.default.createElement(
                  'li',
                  null,
                  'Rule 1'
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  'Rule 2'
                ),
                _react2.default.createElement(
                  'li',
                  null,
                  'Rule 3'
                )
              )
            )
          )
        )
      );
    }
  }]);

  return AddProxy;
}(_react2.default.Component);

var If = function If(_ref) {
  var when = _ref.when,
      children = _ref.children;
  return when ? children : null;
};

// XXX krzysztof: make modal a common component and share with
// pkg/www/lum/pub/zone.js

var Modal = function (_React$Component2) {
  _inherits(Modal, _React$Component2);

  function Modal() {
    _classCallCheck(this, Modal);

    return _possibleConstructorReturn(this, (Modal.__proto__ || Object.getPrototypeOf(Modal)).apply(this, arguments));
  }

  _createClass(Modal, [{
    key: 'click_btn',
    value: function click_btn() {
      if (this.props.click_btn()) document.getElementById(this.props.id).modal('hide');
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { id: this.props.id, className: 'modal fade add_proxy_modal',
          tabIndex: '-1' },
        _react2.default.createElement(
          'div',
          { className: 'modal-dialog' },
          _react2.default.createElement(
            'div',
            { className: 'modal-content' },
            _react2.default.createElement(
              'div',
              { className: 'modal-header' },
              _react2.default.createElement('button', { className: 'close close_icon', 'data-dismiss': 'modal',
                'aria-label': 'Close' }),
              _react2.default.createElement(
                'h4',
                { className: 'modal-title' },
                this.props.title
              )
            ),
            _react2.default.createElement(
              'div',
              { className: 'modal-body' },
              this.props.children
            ),
            _react2.default.createElement(
              'div',
              { className: 'modal-footer' },
              _react2.default.createElement(
                'button',
                { className: 'btn btn_lpm_default btn_lpm options' },
                'Advanced options'
              ),
              _react2.default.createElement(
                'button',
                { className: 'btn btn_lpm save' },
                'Save'
              )
            )
          )
        )
      );
    }
  }]);

  return Modal;
}(_react2.default.Component);

exports.default = AddProxy;

/***/ }),

/***/ 687:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true, es6:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _classnames = __webpack_require__(7);

var _classnames2 = _interopRequireDefault(_classnames);

var _jquery = __webpack_require__(21);

var _jquery2 = _interopRequireDefault(_jquery);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _ajax = __webpack_require__(296);

var _ajax2 = _interopRequireDefault(_ajax);

var _common = __webpack_require__(64);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Index = function (_React$Component) {
    _inherits(Index, _React$Component);

    function Index(props) {
        _classCallCheck(this, Index);

        var _this2 = _possibleConstructorReturn(this, (Index.__proto__ || Object.getPrototypeOf(Index)).call(this, props));

        _this2.state = { tab: 'target', cities: {}, fields: {} };
        if (!props.extra) {
            window.location.href = '/';
            _this2.proxy = { zones: {} };
        } else _this2.proxy = props.extra;
        return _this2;
    }

    _createClass(Index, [{
        key: 'componentWillMount',
        value: function componentWillMount() {
            var _this = this;
            (0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var consts;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _ajax2.default.json({ url: '/api/consts' });

                            case 2:
                                consts = _context.sent;

                                _this.setState({ consts: consts });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            }));
        }
    }, {
        key: 'componentDidMount',
        value: function componentDidMount() {
            (0, _jquery2.default)('[data-toggle="tooltip"]').tooltip();
        }
    }, {
        key: 'click_tab',
        value: function click_tab(tab) {
            this.setState({ tab: tab });
        }
    }, {
        key: 'update_states_and_cities',
        value: function update_states_and_cities(country, states, cities) {
            this.setState(function (prev_state) {
                return {
                    states: Object.assign({}, prev_state.states, _defineProperty({}, country, states)),
                    cities: Object.assign({}, prev_state.cities, _defineProperty({}, country, cities))
                };
            });
        }
    }, {
        key: 'field_changed',
        value: function field_changed(field_name, value) {
            this.setState(function (prev_state) {
                return { fields: Object.assign({}, prev_state.fields, _defineProperty({}, field_name, value)) };
            });
        }
    }, {
        key: 'render',
        value: function render() {
            var Main_window = void 0;
            switch (this.state.tab) {
                case 'target':
                    Main_window = Target;break;
                case 'speed':
                    Main_window = To_implement;break;
                case 'zero':
                    Main_window = To_implement;break;
                case 'rotation':
                    Main_window = To_implement;break;
                case 'debug':
                    Main_window = To_implement;break;
                case 'general':
                    Main_window = To_implement;break;
            }
            return _react2.default.createElement(
                'div',
                { className: 'lpm edit_proxy' },
                _react2.default.createElement(
                    'h3',
                    null,
                    'Edit port ',
                    this.props.port
                ),
                _react2.default.createElement(Nav, { zones: Object.keys(this.proxy.zones) }),
                _react2.default.createElement(Nav_tabs, { curr_tab: this.state.tab, fields: this.state.fields,
                    on_tab_click: this.click_tab.bind(this) }),
                _react2.default.createElement(Main_window, _extends({}, this.state.consts, { cities: this.state.cities,
                    states: this.state.states,
                    update_states_and_cities: this.update_states_and_cities.bind(this),
                    on_change_field: this.field_changed.bind(this),
                    fields: this.state.fields }))
            );
        }
    }]);

    return Index;
}(_react2.default.Component);

var Nav = function Nav(props) {
    return _react2.default.createElement(
        'div',
        { className: 'nav' },
        _react2.default.createElement(Field, { options: props.zones, label: 'Zone' }),
        _react2.default.createElement(Field, { options: _common.presets.map(function (p) {
                return p.title;
            }), label: 'Preset' }),
        _react2.default.createElement(Action_buttons, null)
    );
};

var Field = function Field(props) {
    var options = props.options || [];
    return _react2.default.createElement(
        'div',
        { className: 'field' },
        _react2.default.createElement(
            'div',
            { className: 'title' },
            props.label
        ),
        _react2.default.createElement(
            'select',
            null,
            options.map(function (o) {
                return _react2.default.createElement(
                    'option',
                    { key: o, value: '' },
                    o
                );
            })
        )
    );
};

var Action_buttons = function Action_buttons() {
    return _react2.default.createElement(
        'div',
        { className: 'action_buttons' },
        _react2.default.createElement(
            'button',
            { className: 'btn btn_lpm btn_lpm_normal btn_cancel' },
            'Cancel'
        ),
        _react2.default.createElement(
            'button',
            { className: 'btn btn_lpm btn_save' },
            'Save'
        )
    );
};

var Nav_tabs = function Nav_tabs(props) {
    return _react2.default.createElement(
        'div',
        { className: 'nav_tabs' },
        _react2.default.createElement(Tab_btn, _extends({}, props, { id: 'target' })),
        _react2.default.createElement(Tab_btn, _extends({}, props, { error: true, id: 'speed' })),
        _react2.default.createElement(Tab_btn, _extends({}, props, { id: 'zero' })),
        _react2.default.createElement(Tab_btn, _extends({}, props, { id: 'rotation' })),
        _react2.default.createElement(Tab_btn, _extends({}, props, { id: 'debug' })),
        _react2.default.createElement(Tab_btn, _extends({}, props, { id: 'general' }))
    );
};

var Tab_btn = function Tab_btn(props) {
    var btn_class = (0, _classnames2.default)('btn_tab', { active: props.curr_tab == props.id });
    var labels = {
        target: 'Targeting',
        speed: 'Request Speed',
        zero: 'Zero fail',
        rotation: 'IP Control',
        debug: 'Debugging',
        general: 'General'
    };
    var tooltips = {
        target: 'Select specific targeting for your proxy exit node',
        speed: 'Control the speed of your request to improve performance',
        zero: 'Configure rules to handle failed requests',
        rotation: 'Set the conditions for which your IPs will change',
        debug: 'Improve the info you receive from the Proxy Manager',
        general: ''
    };
    var fields = {
        target: ['country', 'city', 'state', 'asn'],
        speed: [],
        zero: [],
        rotation: [],
        debug: [],
        general: []
    };
    var changes = Object.keys(props.fields).filter(function (f) {
        var val = props.fields[f];
        return fields[props.id].includes(f) && val && val != '*';
    }).length;
    return _react2.default.createElement(
        'div',
        { onClick: function onClick() {
                return props.on_tab_click(props.id);
            },
            className: btn_class },
        _react2.default.createElement(Tab_icon, { id: props.id, error: props.error, changes: changes }),
        _react2.default.createElement(
            'div',
            { className: 'title' },
            labels[props.id]
        ),
        _react2.default.createElement('div', { className: 'arrow' }),
        _react2.default.createElement(Tooltip_icon, { title: tooltips[props.id] })
    );
};

var Tab_icon = function Tab_icon(props) {
    var circle_class = (0, _classnames2.default)('circle_wrapper', {
        active: props.error || props.changes, error: props.error });
    var content = props.error ? '!' : props.changes;
    return _react2.default.createElement(
        'div',
        { className: (0, _classnames2.default)('icon', props.id) },
        _react2.default.createElement(
            'div',
            { className: circle_class },
            _react2.default.createElement(
                'div',
                { className: 'circle' },
                content
            )
        )
    );
};

var Tooltip_icon = function Tooltip_icon(props) {
    return props.title ? _react2.default.createElement('div', { className: 'info', 'data-toggle': 'tooltip',
        'data-placement': 'bottom', title: props.title }) : null;
};

var Section = function (_React$Component2) {
    _inherits(Section, _React$Component2);

    function Section(props) {
        _classCallCheck(this, Section);

        var _this3 = _possibleConstructorReturn(this, (Section.__proto__ || Object.getPrototypeOf(Section)).call(this, props));

        _this3.state = { focused: false };
        _this3.tooltip = {
            country: 'Choose your exit country for your requests',
            city: 'The city from which IP will be allocated',
            asn: 'Specifc ASN provider',
            state: 'Specific state in a given country'
        };
        return _this3;
    }

    _createClass(Section, [{
        key: 'on_focus',
        value: function on_focus() {
            this.setState({ focused: true });
        }
    }, {
        key: 'on_blur',
        value: function on_blur() {
            this.setState({ focused: false });
        }
    }, {
        key: 'render',
        value: function render() {
            var dynamic_class = {
                error: this.props.error,
                correct: this.props.correct,
                active: this.props.active || this.state.focused
            };
            return _react2.default.createElement(
                'div',
                { tabIndex: '0', onFocus: this.on_focus.bind(this),
                    onBlur: this.on_blur.bind(this), className: 'section_wrapper' },
                _react2.default.createElement(
                    'div',
                    { className: (0, _classnames2.default)('section', dynamic_class) },
                    this.props.children,
                    _react2.default.createElement('div', { className: 'icon' }),
                    _react2.default.createElement('div', { className: 'arrow' })
                ),
                _react2.default.createElement(
                    'div',
                    { className: 'message_wrapper' },
                    _react2.default.createElement(
                        'div',
                        { className: (0, _classnames2.default)('message', dynamic_class) },
                        this.tooltip[this.props.id]
                    )
                )
            );
        }
    }]);

    return Section;
}(_react2.default.Component);

var Target = function (_React$Component3) {
    _inherits(Target, _React$Component3);

    function Target() {
        _classCallCheck(this, Target);

        return _possibleConstructorReturn(this, (Target.__proto__ || Object.getPrototypeOf(Target)).apply(this, arguments));
    }

    _createClass(Target, [{
        key: 'allowed_countries',
        value: function allowed_countries() {
            var countries = this.props.proxy && this.props.proxy.country.values || [];
            if (this.props.zone == 'static') {
                countries = this.props.proxy.countries.filter(function (c) {
                    return ['', 'au', 'br', 'de', 'gb', 'us'].includes(c.value);
                });
            }
            return countries;
        }
    }, {
        key: 'country_changed',
        value: function country_changed(e) {
            var country = e.target.value;
            if (this.props.cities[country]) return;
            var _this = this;
            (0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee2() {
                var cities, states;
                return _regeneratorRuntime2.default.wrap(function _callee2$(_context2) {
                    while (1) {
                        switch (_context2.prev = _context2.next) {
                            case 0:
                                _context2.next = 2;
                                return _ajax2.default.json({ url: '/api/cities/' + country });

                            case 2:
                                cities = _context2.sent;
                                _context2.next = 5;
                                return _ajax2.default.json({ url: '/api/regions/' + country });

                            case 5:
                                states = _context2.sent;

                                _this.props.update_states_and_cities(country, states, cities);

                            case 7:
                            case 'end':
                                return _context2.stop();
                        }
                    }
                }, _callee2, this);
            }));
            this.props.on_change_field('city', '');
            this.props.on_change_field('state', '');
            this.props.on_change_field('country', country);
        }
    }, {
        key: 'states',
        value: function states() {
            var country = this.props.fields.country;
            return country && this.props.states && this.props.states[country] || [];
        }
    }, {
        key: 'state_changed',
        value: function state_changed(e) {
            this.props.on_change_field('city', '');
            this.props.on_change_field('state', e.target.value);
        }
    }, {
        key: 'cities',
        value: function cities() {
            var country = this.props.fields.country;
            var state = this.props.fields.state;
            var cities = country && this.props.cities[country] || [];
            if (state) return cities.filter(function (c) {
                return c.region == state || !c.region || c.region == '*';
            });else return cities;
        }
    }, {
        key: 'render',
        value: function render() {
            var _this5 = this;

            // XXX krzysztof: make a generic component for Sections that wrapps
            // common logic like setting new values, validation
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    Section,
                    { correct: this.props.fields.country && this.props.fields.country != '*', id: 'country' },
                    _react2.default.createElement(
                        'div',
                        { className: 'desc' },
                        'Country'
                    ),
                    _react2.default.createElement(
                        'select',
                        { value: this.props.fields.country,
                            onChange: this.country_changed.bind(this) },
                        this.allowed_countries().map(function (c, i) {
                            return _react2.default.createElement(
                                'option',
                                { key: i, value: c.value },
                                c.key
                            );
                        })
                    )
                ),
                _react2.default.createElement(
                    Section,
                    { correct: this.props.fields.state && this.props.fields.state != '*', id: 'state' },
                    _react2.default.createElement(
                        'div',
                        { className: 'desc' },
                        'State'
                    ),
                    _react2.default.createElement(
                        'select',
                        { value: this.props.fields.state,
                            onChange: this.state_changed.bind(this) },
                        this.states().map(function (c, i) {
                            return _react2.default.createElement(
                                'option',
                                { key: i, value: c.value },
                                c.key
                            );
                        })
                    )
                ),
                _react2.default.createElement(
                    Section,
                    { correct: this.props.fields.city && this.props.fields.city != '*', id: 'city' },
                    _react2.default.createElement(
                        'div',
                        { className: 'desc' },
                        'City'
                    ),
                    _react2.default.createElement(
                        'select',
                        { value: this.props.fields.city,
                            onChange: function onChange(e) {
                                return _this5.props.on_change_field('city', e.target.value);
                            } },
                        this.cities().map(function (c, i) {
                            return _react2.default.createElement(
                                'option',
                                { key: i, value: c.value },
                                c.key
                            );
                        })
                    )
                ),
                _react2.default.createElement(
                    Section,
                    { correct: this.props.fields.asn && this.props.fields.asn != '*', id: 'asn' },
                    _react2.default.createElement(
                        'div',
                        { className: 'desc' },
                        'ASN'
                    ),
                    _react2.default.createElement('input', { type: 'number', value: this.props.fields.asn,
                        onChange: function onChange(e) {
                            return _this5.props.on_change_field('asn', e.target.value);
                        } })
                )
            );
        }
    }]);

    return Target;
}(_react2.default.Component);

var To_implement = function To_implement() {
    return _react2.default.createElement(
        'div',
        null,
        _react2.default.createElement(
            Section,
            null,
            _react2.default.createElement(
                'div',
                { className: 'desc' },
                'Normal field with text that takes more than one line'
            ),
            _react2.default.createElement('input', { type: 'number' })
        ),
        _react2.default.createElement(
            Section,
            { correct: true },
            _react2.default.createElement(
                'div',
                { className: 'desc' },
                'Correctly chosen option'
            ),
            _react2.default.createElement(
                'select',
                null,
                _react2.default.createElement(
                    'option',
                    null,
                    'United States'
                )
            )
        ),
        _react2.default.createElement(
            Section,
            { error: true },
            _react2.default.createElement(
                'div',
                { className: 'desc' },
                'Option with an error'
            ),
            _react2.default.createElement(
                'select',
                null,
                _react2.default.createElement(
                    'option',
                    null,
                    'Warsaw'
                )
            )
        ),
        _react2.default.createElement(
            Section,
            { active: true },
            _react2.default.createElement(
                'div',
                { className: 'desc' },
                'Currently focused option by user'
            ),
            _react2.default.createElement('input', { type: 'text' })
        )
    );
};

exports.default = Index;

/***/ }),

/***/ 688:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _lodash = __webpack_require__(48);

var _lodash2 = _interopRequireDefault(_lodash);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

var _domains = __webpack_require__(128);

var _status_codes = __webpack_require__(98);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('protocol_detail', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var StatsDetails = function (_React$Component) {
    _inherits(StatsDetails, _React$Component);

    function StatsDetails(props) {
        _classCallCheck(this, StatsDetails);

        var _this2 = _possibleConstructorReturn(this, (StatsDetails.__proto__ || Object.getPrototypeOf(StatsDetails)).call(this, props));

        _this2.state = {
            statuses: { stats: [] },
            domains: { stats: [] }
        };
        return _this2;
    }

    _createClass(StatsDetails, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.t0 = _this;
                                _context.next = 3;
                                return _common2.default.StatsService.get(_this.props.protocol);

                            case 3:
                                _context.t1 = _context.sent;
                                _context.t2 = {
                                    stats: _context.t1
                                };

                                _context.t0.setState.call(_context.t0, _context.t2);

                                _context.next = 8;
                                return _common2.default.StatsService.get_top({ sort: 1, limit: 5 });

                            case 8:
                                res = _context.sent;

                                _this.setState(_lodash2.default.pick(res, ['statuses', 'domains']));

                            case 10:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _common2.default.StatsDetails,
                { stats: this.state.stats,
                    header: 'Protocol: ' + this.props.protocol.toUpperCase() },
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Domains'
                    ),
                    _react2.default.createElement(_domains.DomainTable, { stats: this.state.domains.stats, go: true })
                ),
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 6 },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Status codes'
                    ),
                    _react2.default.createElement(_status_codes.StatusCodeTable, { stats: this.state.statuses.stats, go: true })
                )
            );
        }
    }]);

    return StatsDetails;
}(_react2.default.Component);

exports.default = StatsDetails;

/***/ }),

/***/ 689:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _common = __webpack_require__(64);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var thumb_style = { margin: '10px' };

var Message = function (_React$Component) {
    _inherits(Message, _React$Component);

    function Message() {
        var _ref;

        var _temp, _this2, _ret;

        _classCallCheck(this, Message);

        for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
            args[_key] = arguments[_key];
        }

        return _ret = (_temp = (_this2 = _possibleConstructorReturn(this, (_ref = Message.__proto__ || Object.getPrototypeOf(Message)).call.apply(_ref, [this].concat(args))), _this2), _this2.thumbs_up = function () {
            return _this2.props.on_thumbs_up(_this2.props.msg);
        }, _this2.thumbs_down = function () {
            return _this2.props.on_thumbs_down(_this2.props.msg);
        }, _this2.dismiss = function () {
            return _this2.props.on_dismiss(_this2.props.msg);
        }, _temp), _possibleConstructorReturn(_this2, _ret);
    }

    _createClass(Message, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _reactBootstrap.Col,
                { md: 12, className: 'alert alert-info settings-alert' },
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 8 },
                    this.props.msg.message
                ),
                _react2.default.createElement(
                    _reactBootstrap.Col,
                    { md: 4, className: 'text-right' },
                    _react2.default.createElement(
                        'a',
                        { className: 'custom_link', onClick: this.thumbs_up, href: '#',
                            style: thumb_style },
                        _react2.default.createElement('img', { src: 'img/ic_thumbs_up.svg' })
                    ),
                    _react2.default.createElement(
                        'a',
                        { className: 'custom_link', onClick: this.thumbs_down, href: '#',
                            style: thumb_style },
                        _react2.default.createElement('img', { src: 'img/ic_thumbs_down.svg' })
                    ),
                    _react2.default.createElement(
                        _reactBootstrap.Button,
                        { bsSize: 'small', bsStyle: 'link', onClick: this.dismiss },
                        'Dismiss'
                    )
                )
            );
        }
    }]);

    return Message;
}(_react2.default.Component);

var MessageList = function (_React$Component2) {
    _inherits(MessageList, _React$Component2);

    function MessageList(props) {
        _classCallCheck(this, MessageList);

        var _this3 = _possibleConstructorReturn(this, (MessageList.__proto__ || Object.getPrototypeOf(MessageList)).call(this, props));

        _this3.thumbs_up = function (msg) {
            _this3.hide(msg);
            _util2.default.ga_event('message', msg.id, 'thumbs_up');
        };

        _this3.thumbs_down = function (msg) {
            _this3.hide(msg);
            _util2.default.ga_event('message', msg.id, 'thumbs_down');
        };

        _this3.dismiss = function (msg) {
            _this3.hide(msg);
            _util2.default.ga_event('message', msg.id, 'dismiss');
        };

        _this3.hide = _etask2.default._fn( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee(_this, msg) {
            return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                while (1) {
                    switch (_context.prev = _context.next) {
                        case 0:
                            _this.setState({ show_thank_you: true });
                            window.localStorage.setItem(msg.id, JSON.stringify(msg));
                            _context.next = 4;
                            return _etask2.default.sleep(2000);

                        case 4:
                            _this.setState({ messages: _this.state.messages.filter(function (m) {
                                    return m != msg;
                                }),
                                show_thank_you: false });

                        case 5:
                        case 'end':
                            return _context.stop();
                    }
                }
            }, _callee, this);
        }));

        _this3.state = {
            messages: [{ message: 'Did it work?', id: 'concurrent_connections' }].filter(function (m) {
                return !window.localStorage.getItem(m.id);
            })
        };
        return _this3;
    }

    _createClass(MessageList, [{
        key: 'render',
        value: function render() {
            var _this4 = this;

            return _react2.default.createElement(
                _reactBootstrap.Col,
                { md: 7, className: 'messages' },
                this.state.messages.map(function (m) {
                    return _react2.default.createElement(Message, { msg: m, key: m.id, on_thumbs_up: _this4.thumbs_up,
                        on_thumbs_down: _this4.thumbs_down,
                        on_dismiss: _this4.dismiss });
                }),
                _react2.default.createElement(
                    _common.Dialog,
                    { title: 'Thank you for your feedback',
                        show: this.state.show_thank_you },
                    _react2.default.createElement(
                        'p',
                        null,
                        'We appreciate it!'
                    )
                )
            );
        }
    }]);

    return MessageList;
}(_react2.default.Component);

exports.default = MessageList;

/***/ }),

/***/ 703:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(704);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(57)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../node_modules/css-loader/index.js?-url!../../node_modules/less-loader/dist/cjs.js!./app.less", function() {
			var newContent = require("!!../../node_modules/css-loader/index.js?-url!../../node_modules/less-loader/dist/cjs.js!./app.less");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 704:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(56)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: 'Lato';\n  font-style: normal;\n  font-weight: 400;\n  src: local('Lato Regular'), local('Lato-Regular'), url(/font/lato_regular.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\n@font-face {\n  font-family: 'Lato';\n  font-style: normal;\n  font-weight: 700;\n  src: local('Lato Bold'), local('Lato-Bold'), url(/font/lato_bold.woff2) format('woff2');\n  unicode-range: U+0000-00FF, U+0131, U+0152-0153, U+02C6, U+02DA, U+02DC, U+2000-206F, U+2074, U+20AC, U+2212, U+2215;\n}\nbody {\n  font-family: \"Noto Sans\", sans-serif;\n  font-size: 15px;\n  line-height: 23px;\n  overflow-y: scroll;\n}\n.no_nav .page-body {\n  margin-left: 0;\n}\n.no_nav .nav_top {\n  background-color: white;\n}\n.page-body {\n  margin-left: 224px;\n}\n.page-body a {\n  color: #428bca;\n  outline: 3px solid transparent;\n  border: 1px solid transparent;\n}\n.page-body a:hover {\n  color: white;\n  background: #428bca;\n  border-color: #428bca;\n  text-decoration: none;\n  box-shadow: #428bca -2px 0 0 1px, #428bca 2px 0 0 1px;\n  border-radius: .15em;\n}\ncode {\n  background: lightgrey;\n  color: black;\n  white-space: nowrap;\n}\n.nowrap {\n  white-space: nowrap;\n}\npre.top-margin {\n  margin-top: 4px;\n}\n.container {\n  width: auto;\n}\n.main-container-qs {\n  margin-left: 25%;\n}\n.qs-move-control {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  width: 2px;\n  cursor: col-resize;\n}\n.btn-title {\n  float: right;\n  margin-top: -4px;\n  margin-right: 15px;\n  margin-bottom: -5px;\n}\n.header {\n  height: 60px;\n}\n.header img {\n  margin-top: 10px;\n}\nnav a:hover {\n  box-shadow: none;\n}\n.overall-success-ratio {\n  margin-bottom: 20px;\n}\n.success_title {\n  font-size: 22px;\n  cursor: pointer;\n}\n.success_value {\n  text-align: right;\n  font-size: 22px;\n  cursor: pointer;\n  color: #428bca;\n}\n.block {\n  background: #eeeeee;\n  padding: 1em;\n  margin-bottom: 20px;\n}\n.form-group {\n  margin-bottom: 12px;\n}\n.alert-inline {\n  display: inline;\n  padding: 6px 12px;\n  position: relative;\n  top: 2px;\n  margin: 0 8px;\n}\n.tester-body {\n  margin-bottom: 18px;\n}\n.tester-body textarea {\n  height: 100px;\n}\n.tools-header {\n  margin-bottom: 12px;\n}\n.tester-body:after,\n.tools-header:after {\n  content: '';\n  display: block;\n  clear: both;\n}\n.tools-add-header {\n  margin-bottom: 18px;\n}\n.tester-alert {\n  margin-top: 20px;\n  padding: 7.5px 11.5px;\n}\n.tester-results {\n  margin-top: 20px;\n}\n.tools-table {\n  width: auto;\n  float: none;\n  margin: 20px auto;\n}\n.tools-table th {\n  text-align: center;\n}\n.countries-list {\n  text-align: center;\n  margin-top: 20px;\n}\n.countries-list > div {\n  padding: 10px;\n  display: inline-block;\n  width: 200px;\n  white-space: nowrap;\n  overflow: hidden;\n  text-align: left;\n  position: relative;\n  border: 1px solid black;\n  margin: 5px 10px;\n}\n.countries-list .glyphicon {\n  color: grey;\n}\n.countries-list .glyphicon-ok {\n  color: green !important;\n}\n.countries-list .glyphicon-download-alt {\n  color: blue !important;\n}\n.countries-failed {\n  color: red !important;\n}\n.countries-canceled {\n  color: orange !important;\n}\n.countries-op {\n  display: inline-block;\n  position: absolute;\n  right: 0;\n  width: 40px;\n  padding-left: 10px;\n  background: white;\n  background: linear-gradient(to right, rgba(255, 255, 255, 0), white 25%);\n}\n.countries-op span:hover {\n  color: orange;\n  cursor: pointer;\n}\n.countries-view {\n  border-bottom: 1px dashed;\n  cursor: pointer;\n}\n#countries-screenshot .modal-dialog {\n  width: auto;\n  margin-left: 20px;\n  margin-right: 20px;\n}\n#countries-screenshot .modal-body > div {\n  overflow: auto;\n  max-height: calc(100vh - 164px);\n}\ntable.proxies {\n  table-layout: fixed;\n  min-width: 100%;\n  width: auto;\n}\n.proxies-settings,\n.columns-settings {\n  overflow: auto;\n  max-height: calc(100vh - 190px);\n}\n.proxies-panel {\n  overflow: auto;\n}\ndiv.proxies .panel-footer,\ndiv.proxies .panel-heading {\n  position: relative;\n}\ndiv.proxies .panel-heading {\n  height: 65px;\n}\ndiv.proxies .btn-wrapper {\n  position: absolute;\n  right: 10px;\n  top: 10px;\n}\n.proxies .btn-csv {\n  font-size: 12px;\n}\n.proxies-default {\n  color: gray;\n}\n.proxies-editable {\n  cursor: pointer;\n  position: relative;\n  display: inline-block;\n  min-height: 20px;\n  min-width: 100%;\n}\n.proxies-editable:hover {\n  color: orange;\n}\n.proxies-table-input {\n  position: absolute;\n  z-index: 2;\n  left: -25px;\n  right: -25px;\n  top: -7px;\n}\n.proxies-table-input input,\n.proxies-table-input select {\n  width: 100%;\n}\n.proxies-check {\n  width: 32px;\n}\n.col_success_rate {\n  white-space: nowrap;\n  width: 80px;\n}\n.proxies-success-rate-value {\n  color: #428bca;\n  width: 80px;\n  font-size: 16px;\n  cursor: pointer;\n}\n.proxies-actions {\n  white-space: nowrap;\n  width: 80px;\n}\n.proxies-action {\n  cursor: pointer;\n  color: #428bca;\n  outline: 3px solid transparent;\n  border: 1px solid transparent;\n  line-height: 20px;\n  margin: 0;\n}\n.proxies-action-disabled {\n  border: 1px solid transparent;\n  line-height: 20px;\n  margin: 0;\n}\n.proxies-action-edit {\n  visibility: hidden;\n}\n.proxies tr:hover .proxies-action-edit {\n  visibility: visible;\n  cursor: pointer;\n}\n.proxies-action-delete,\n.proxies-action-duplicate {\n  cursor: pointer;\n}\n.proxies-warning {\n  color: red;\n}\n#history .modal-dialog,\n#history_details .modal-dialog,\n#pool .modal-dialog {\n  width: auto;\n  margin-left: 20px;\n  margin-right: 20px;\n}\n#history .modal-body > div {\n  overflow: auto;\n  max-height: calc(100vh - 164px);\n}\n#history label {\n  font-weight: normal;\n}\n.proxies-history-navigation {\n  margin-bottom: 25px;\n}\n.proxies-history-filter {\n  font-size: 11px;\n  border-bottom: 1px dashed;\n  border-color: #428bca;\n}\n.proxies-history th {\n  line-height: 15px !important;\n}\n.clickable {\n  cursor: pointer;\n}\n.proxies-history-loading {\n  padding: 4px;\n  width: 200px;\n  text-align: center;\n  position: fixed;\n  left: 50%;\n  top: 50%;\n  margin-left: -100px;\n  z-index: 2;\n}\n.proxies-history-archive {\n  float: right;\n  font-size: 11px;\n  line-height: 14px;\n  margin-top: -1px;\n  margin-bottom: -2px;\n  margin-right: 32px;\n  text-align: right;\n}\n.proxies-history-archive > span {\n  border-bottom: 1px dashed;\n  border-color: #428bca;\n  cursor: pointer;\n  text-transform: lowercase;\n}\n.zones-table td,\n.zones-table thead th {\n  text-align: right;\n}\n.zones-table td.zones-zone,\n.zones-table thead th.zones-zone {\n  text-align: left;\n}\n#zone .panel-heading {\n  position: relative;\n}\n#zone .panel-heading button {\n  position: absolute;\n  right: 5px;\n  top: 5px;\n}\n.settings-alert {\n  position: relative;\n}\n.settings-alert .buttons {\n  position: absolute;\n  right: 10px;\n  top: 9px;\n}\n.github {\n  margin-top: 12px;\n}\n#config-textarea,\n#config-textarea + .CodeMirror,\n#resolve-textarea {\n  width: 100%;\n  height: 400px;\n  margin-bottom: 18px;\n}\n.resolve-add-host {\n  margin-top: -6px;\n  margin-bottom: 18px;\n}\n#settings-page {\n  padding-top: 20px;\n}\n.confirmation-items {\n  margin-top: 11px;\n}\n.form-range {\n  width: 100%;\n}\n.form-range .form-control {\n  display: inline-block;\n  width: 48%;\n}\n.form-range .range-seperator {\n  display: inline-block;\n  width: 2%;\n  text-align: center;\n}\n.luminati-login h3 {\n  font-weight: bold;\n  margin-top: 20px;\n  margin-bottom: 20px;\n}\n.luminati-login .alert-danger {\n  color: #d00;\n}\n.luminati-login label {\n  color: #818c93;\n  font-weight: normal;\n}\n.luminati-login button {\n  margin-top: 15px;\n  font-weight: bold;\n  padding: 10px 12px;\n  background-image: -o-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#37a3eb), to(#2181cf));\n  background-image: -webkit-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: -moz-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: linear-gradient(top, #37a3eb, #2181cf);\n  border: 1px solid #1c74b3;\n  border-bottom-color: #0d5b97;\n  border-top-color: #2c8ed1;\n  box-shadow: 0 1px 0 #ddd, inset 0 1px 0 rgba(255, 255, 255, 0.2);\n  color: #fff !important;\n  text-shadow: rgba(0, 0, 0, 0.2) 0 1px 0;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n  -moz-user-select: none;\n  -webkit-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n  -webkit-tap-highlight-color: transparent;\n}\n.luminati-login button:hover:enabled {\n  background-color: #3baaf4;\n  background-image: -o-linear-gradient(top, #3baaf4, #2389dc);\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#3baaf4), to(#2389dc));\n  background-image: -webkit-linear-gradient(top, #3baaf4, #2389dc);\n  background-image: -moz-linear-gradient(top, #3baaf4, #2389dc);\n  background-image: linear-gradient(top, #3baaf4, #2389dc);\n}\n.luminati-login button:active {\n  background-image: -o-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: -webkit-gradient(linear, left top, left bottom, from(#37a3eb), to(#2181cf));\n  background-image: -webkit-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: -moz-linear-gradient(top, #37a3eb, #2181cf);\n  background-image: linear-gradient(top, #37a3eb, #2181cf);\n}\n.luminati-login .signup {\n  color: #818c93;\n  font-size: 16.5px;\n  margin-top: 12px;\n}\n#google {\n  min-width: 300px;\n}\n#google a.google {\n  color: white;\n  display: block;\n  padding: 0;\n  margin: auto;\n  margin-top: 50px;\n  margin-bottom: 40px;\n  height: 35px;\n  font-size: 16px;\n  padding-top: 6px;\n  padding-left: 95px;\n  cursor: pointer;\n  max-width: 300px;\n  text-align: left;\n  text-decoration: none;\n  border: none;\n  position: relative;\n  white-space: nowrap;\n}\n#google a.google,\n#google a.google:hover {\n  background: url(/img/social_btns.svg) no-repeat 50% 100%;\n}\n#google a.google:focus {\n  outline: 0;\n  top: 1px;\n}\n#google a.google:hover {\n  border: none;\n  box-shadow: none;\n  border-radius: 0;\n}\n#google a.google:active {\n  top: 1px;\n}\n.panel .panel-heading button.btn.btn-ico {\n  padding: 7px;\n  border: solid 1px #c8c2bf;\n  background-color: #fcfcfc;\n  width: 35px;\n  height: 34px;\n  margin: 0 1px;\n}\n.panel .panel-heading button.btn.btn-ico.add_proxy_btn {\n  color: #004d74;\n  background-color: #05bed1;\n  border-color: #05bed1;\n}\n.panel .panel-heading button.btn.btn-ico img {\n  width: 100%;\n  height: 100%;\n  vertical-align: baseline;\n}\n.panel .panel-heading button.btn.btn-ico[disabled] img {\n  opacity: 0.25;\n}\n.tooltip.in {\n  opacity: 1;\n}\n.tooltip-proxy-status .tooltip-inner,\n.tooltip-default .tooltip-inner,\n.tooltip .tooltip-inner {\n  max-width: 250px;\n  border: solid 1px black;\n  background: #fff;\n  color: black;\n}\n.status-details-wrapper {\n  background: #f7f7f7;\n  font-size: 12px;\n}\n.status-details-line {\n  margin: 0 0 5px 25px;\n}\n.status-details-icon-warn {\n  vertical-align: bottom;\n  padding-bottom: 1px;\n}\n.status-details-text {\n  padding: 0 0 0 5px;\n}\n.ic-status-triangle {\n  font-size: 12px;\n  color: #979797;\n}\n.text-err {\n  color: #d8393c;\n}\n.text-ok {\n  color: #4ca16a;\n}\n.text-warn {\n  color: #f5a623;\n}\n.pointer {\n  cursor: pointer;\n}\n.opened,\n.table-hover > tbody > tr.opened:hover {\n  background-color: #d7f6ff;\n}\n.table-hover > tbody > tr > td {\n  border: none;\n}\n.table-hover .no-hover:hover {\n  background: none;\n}\n.pull-none {\n  float: none !important;\n}\n.history__header {\n  margin-top: 10px;\n}\n.history-details__column-first {\n  width: 300px;\n}\n.modal-open .modal {\n  overflow-y: scroll;\n}\n.blue {\n  color: #4a90e2;\n}\n.pagination > li > a:hover,\n.pagination > .disabled > a:hover {\n  box-shadow: none;\n}\n.control-label.preset {\n  width: 100%;\n}\n.control-label.preset .form-control {\n  width: auto;\n  display: inline-block;\n}\ninput.form-control[type=checkbox] {\n  width: auto;\n  height: auto;\n  display: inline;\n}\n.proxies-table-input.session-edit input {\n  width: calc(100% - 2em);\n  display: inline-block;\n}\n.proxies-table-input.session-edit .btn {\n  padding: 4px;\n}\n.tabs_default:hover {\n  color: #555 !important;\n  box-shadow: none !important;\n}\n.chrome_icon {\n  width: 32px;\n  height: 32px;\n  background-image: url('img/icon_chrome.jpg');\n  background-repeat: no-repeat;\n  background-size: 32px 32px;\n  margin: auto;\n}\n.firefox_icon {\n  width: 32px;\n  height: 32px;\n  background-image: url(img/icon_firefox.jpg);\n  background-repeat: no-repeat;\n  background-size: 32px 32px;\n  margin: auto;\n}\n.safari_icon {\n  width: 32px;\n  height: 32px;\n  background-image: url(img/icon_safari.jpg);\n  background-repeat: no-repeat;\n  background-size: 32px 32px;\n  margin: auto;\n}\n.stats_row_change {\n  animation: pulse 1s;\n}\n.row_clickable {\n  cursor: pointer;\n}\n.code_max_height {\n  max-height: 500px;\n}\n.table-fixed {\n  table-layout: fixed;\n}\n.overflow-ellipsis {\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.page-body .messages a.custom_link:hover {\n  background: none;\n  border: none;\n  box-shadow: none;\n}\n.pagination {\n  margin: 0;\n}\n.pagination .active > a,\n.pagination .active > a:focus,\n.pagination .active > span {\n  background: none;\n  color: black;\n  font-weight: bold;\n}\n.pagination .active > a:hover,\n.pagination .active > a:focus:hover,\n.pagination .active > span:hover {\n  background: none;\n  color: black;\n  font-weight: bold;\n}\n.pagination li > a,\n.pagination li > span,\n.pagination li > a:focus {\n  font-size: 14px;\n  padding: 0 5px;\n  color: #428bca;\n  line-height: 1.4;\n  background: none;\n  border: none;\n}\n.pagination li > a:hover,\n.pagination li > span:hover,\n.pagination li > a:focus:hover {\n  border: none;\n  background: none;\n  color: white;\n  background: #428bca;\n}\n.lpm {\n  font-family: \"Lato\";\n  color: #004d74;\n}\n.lpm h1 {\n  font-size: 36px;\n  font-weight: 500;\n  margin: 0;\n}\n.lpm h2 {\n  color: #05bed1;\n  font-size: 36px;\n  font-weight: bold;\n  letter-spacing: 1px;\n  margin: 0;\n}\n.lpm h3 {\n  font-size: 24px;\n  letter-spacing: 0.6px;\n  font-weight: bold;\n  margin: 0;\n  line-height: 1;\n}\n.lpm h4 {\n  margin: 0;\n}\n.lpm a {\n  color: #05bed1;\n  cursor: pointer;\n  border: none;\n  text-decoration: underline;\n}\n.lpm a:hover {\n  color: #05bed1;\n  cursor: pointer;\n  background: rgba(0, 0, 0, 0);\n  border: none;\n  box-shadow: none;\n}\n.lpm select,\n.lpm input {\n  width: 100%;\n  height: 32px;\n  background-color: white;\n  border: solid 1px #ccdbe3;\n  border-radius: 3px;\n  padding-left: 10px;\n  font-weight: 300;\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\n.lpm select:focus,\n.lpm input:focus {\n  outline: none;\n  border: solid 1px #05bed1;\n}\n.lpm select {\n  background: url(/img/down.svg) no-repeat;\n  background-position: right 10px center;\n}\n.lpm input[type=number]::-webkit-inner-spin-button,\n.lpm input[type=number]::-webkit-outer-spin-button {\n  -webkit-appearance: none;\n}\n.lpm input[type=number] {\n  -moz-appearance: textfield;\n}\n.lpm .btn_lpm {\n  width: 160px;\n  height: 32px;\n  border-radius: 2px;\n  background-color: #05bed1;\n  border: solid 1px #05bed1;\n  color: white;\n  font-size: 16px;\n  font-weight: bold;\n  padding-top: 3px;\n  margin: 0 5px;\n  box-shadow: none;\n}\n.lpm .btn_lpm:hover {\n  background-color: #004d74;\n  border-color: #004d74;\n}\n.lpm .btn_lpm:active,\n.lpm .btn_lpm.active {\n  background-color: #003d5b;\n  border-color: #003d5b;\n  color: #05bed1;\n}\n.lpm .btn_lpm:focus {\n  outline: none;\n}\n.lpm .btn_lpm_default {\n  color: #05bed1;\n  background-color: white;\n  border-color: #05bed1;\n}\n.lpm .btn_lpm_default:hover {\n  background-color: #B4E6EE;\n  border-color: #05bed1;\n}\n.lpm .btn_lpm_default:active,\n.lpm .btn_lpm_default.active {\n  background-color: #05bed1;\n  border-color: #05bed1;\n  color: white;\n}\n.lpm .btn_lpm_normal {\n  color: #004d74;\n  border-color: #ccdbe3;\n  background-color: white;\n}\n.lpm .btn_lpm_normal:hover {\n  background-color: #f5f5f5;\n  border-color: #ccdbe3;\n}\n.lpm .btn_lpm_normal:active,\n.lpm .btn_lpm_normal.active {\n  background-color: #d7d7d7;\n  border-color: #d7d7d7;\n  color: #004d74;\n}\n.lpm .btn_lpm_big {\n  line-height: 0;\n  font-size: 32px;\n  padding-bottom: 9px;\n  border-radius: 4px;\n  font-weight: 700;\n  width: 280px;\n  height: 60px;\n}\n.lpm .btn_lpm_small {\n  font-size: 11px;\n  height: 27px;\n  width: auto;\n}\n.lpm .btn_copy {\n  color: #05bed1;\n  border-color: #05bed1;\n  font-size: 9px;\n  padding: 0;\n  width: 35px;\n  height: 20px;\n  font-weight: 900;\n  margin-left: 10px;\n  position: relative;\n  top: -1px;\n}\n.lpm .btn_copy:hover {\n  color: white;\n}\n.lpm .modal .modal-content {\n  border: 0;\n  width: 640px;\n}\n.lpm .modal .modal-header {\n  border: 0;\n}\n.lpm .modal .modal-header h4 {\n  font-size: 24px;\n  font-weight: bold;\n  text-align: center;\n  padding-top: 30px;\n  line-height: 0;\n}\n.lpm .modal .modal-header .close_icon {\n  background: url(/img/delete.svg);\n  width: 16px;\n  height: 16px;\n  opacity: 1;\n  position: absolute;\n  top: 19px;\n  right: 19px;\n}\n.lpm .modal .modal-body {\n  padding: 15px 50px 0;\n}\n.lpm .modal .modal-footer {\n  border: 0;\n  text-align: center;\n}\n.edit_proxy h3 {\n  margin-bottom: 20px;\n}\n.edit_proxy .nav {\n  display: flex;\n  margin-bottom: 20px;\n}\n.edit_proxy .nav .field {\n  flex-grow: 1;\n}\n.edit_proxy .nav .field .title {\n  display: inline-block;\n}\n.edit_proxy .nav .field select,\n.edit_proxy .nav .field input {\n  color: #05bed1;\n  font-weight: bold;\n  margin-left: 10px;\n  width: 200px;\n}\n.edit_proxy .nav .action_buttons {\n  flex-grow: 3;\n  display: flex;\n  direction: rtl;\n}\n.edit_proxy .nav .action_buttons .btn_save {\n  margin-right: 0;\n  order: 1;\n}\n.edit_proxy .nav .action_buttons .btn_cancel {\n  margin-left: 0;\n  order: 2;\n}\n.edit_proxy .nav_tabs {\n  display: flex;\n  margin-bottom: 20px;\n  padding-bottom: 20px;\n  border-bottom: solid 1px #E0E9EE;\n}\n.edit_proxy .nav_tabs .btn_tab {\n  flex-grow: 1;\n  height: 100px;\n  margin: 0 3px;\n  background-color: #f5f5f5;\n  border: solid 2px #f5f5f5;\n  border-radius: 4px;\n  cursor: pointer;\n  text-align: center;\n  position: relative;\n}\n.edit_proxy .nav_tabs .btn_tab .icon {\n  width: 30px;\n  height: 30px;\n  opacity: 0.6;\n  margin: auto;\n  position: relative;\n  top: 16px;\n}\n.edit_proxy .nav_tabs .btn_tab .circle_wrapper {\n  display: none;\n  width: 12px;\n  height: 12px;\n  background-color: #05bed1;\n  position: relative;\n  left: 29px;\n  top: -5px;\n  border-radius: 50%;\n}\n.edit_proxy .nav_tabs .btn_tab .circle_wrapper.active {\n  display: block;\n}\n.edit_proxy .nav_tabs .btn_tab .circle_wrapper.error {\n  background-color: #ef6153;\n}\n.edit_proxy .nav_tabs .btn_tab .circle_wrapper .circle {\n  color: white;\n  font-size: 9px;\n  line-height: 0;\n  position: relative;\n  top: 6px;\n  font-weight: bold;\n}\n.edit_proxy .nav_tabs .btn_tab .title {\n  position: absolute;\n  top: 55px;\n  left: 0;\n  right: 0;\n  opacity: 0.8;\n}\n.edit_proxy .nav_tabs .btn_tab .info {\n  background: url(/img/info.svg);\n  width: 11px;\n  height: 11px;\n  opacity: 0.4;\n  position: absolute;\n  bottom: 6px;\n  right: 6px;\n  cursor: pointer;\n}\n.edit_proxy .nav_tabs .btn_tab .icon.target {\n  background: url(/img/target.svg);\n}\n.edit_proxy .nav_tabs .btn_tab .icon.speed {\n  background: url(/img/speed.svg);\n}\n.edit_proxy .nav_tabs .btn_tab .icon.zero {\n  background: url(/img/zero.svg);\n}\n.edit_proxy .nav_tabs .btn_tab .icon.rotation {\n  background: url(/img/rotation.svg);\n}\n.edit_proxy .nav_tabs .btn_tab .icon.debug {\n  background: url(/img/debug.svg);\n}\n.edit_proxy .nav_tabs .btn_tab .icon.general {\n  background: url(/img/general.svg);\n}\n.edit_proxy .nav_tabs .btn_tab:first-child {\n  margin-left: 0;\n}\n.edit_proxy .nav_tabs .btn_tab:last-child {\n  margin-right: 0;\n}\n.edit_proxy .nav_tabs .btn_tab.active,\n.edit_proxy .nav_tabs .btn_tab:hover {\n  border-color: #05bed1;\n  background-color: white;\n}\n.edit_proxy .nav_tabs .btn_tab.active {\n  cursor: default;\n}\n.edit_proxy .nav_tabs .btn_tab.active .icon {\n  opacity: 1;\n}\n.edit_proxy .nav_tabs .btn_tab.active .title {\n  opacity: 1;\n  font-weight: bold;\n}\n.edit_proxy .nav_tabs .btn_tab.active .arrow {\n  border-left: 7px solid transparent;\n  border-right: 7px solid transparent;\n  border-top: 6px solid #05bed1;\n  position: absolute;\n  bottom: -8px;\n  left: 0;\n  right: 0;\n  width: 0;\n  margin: auto;\n}\n.edit_proxy .section_wrapper {\n  display: flex;\n  align-items: center;\n}\n.edit_proxy .section_wrapper:focus {\n  outline: 0;\n}\n.edit_proxy .section_wrapper .section {\n  position: relative;\n  border: solid 1px #E0E9EE;\n  border-radius: 4px;\n  flex: 2 0;\n  padding: 14px 30px;\n  padding-right: 20%;\n  font-size: 14px;\n  margin: 5px 0;\n  display: flex;\n  align-items: center;\n}\n.edit_proxy .section_wrapper .section .desc {\n  width: 40%;\n  line-height: 1.07;\n  padding-right: 35px;\n}\n.edit_proxy .section_wrapper .section select,\n.edit_proxy .section_wrapper .section input {\n  width: 60%;\n}\n.edit_proxy .section_wrapper .section .icon {\n  position: absolute;\n  right: 20px;\n}\n.edit_proxy .section_wrapper .section.error {\n  border-color: #F9BFB9;\n}\n.edit_proxy .section_wrapper .section.error .icon {\n  background: url(/img/error.svg);\n  width: 10px;\n  height: 10px;\n}\n.edit_proxy .section_wrapper .section.error .arrow {\n  border-left: solid 6px #ef6153;\n  border-top: solid 7px transparent;\n  border-bottom: solid 7px transparent;\n  position: absolute;\n  right: -7px;\n}\n.edit_proxy .section_wrapper .section.error input,\n.edit_proxy .section_wrapper .section.error select {\n  border-color: #ef6153;\n}\n.edit_proxy .section_wrapper .section.correct {\n  border-color: #B4E6EE;\n}\n.edit_proxy .section_wrapper .section.correct .desc {\n  color: #05bed1;\n}\n.edit_proxy .section_wrapper .section.correct .icon {\n  background: url(/img/check.svg);\n  width: 11px;\n  height: 8px;\n}\n.edit_proxy .section_wrapper .section.active {\n  border-color: #05bed1;\n}\n.edit_proxy .section_wrapper .section.active .desc {\n  color: #05bed1;\n}\n.edit_proxy .section_wrapper .section.active .arrow {\n  border-left: solid 6px #05bed1;\n  border-top: solid 7px transparent;\n  border-bottom: solid 7px transparent;\n  position: absolute;\n  right: -7px;\n}\n.edit_proxy .section_wrapper .message_wrapper {\n  margin-left: 25px;\n  flex: 1 0;\n  display: inline-block;\n}\n.edit_proxy .section_wrapper .message_wrapper .message {\n  display: none;\n  font-size: 12px;\n  line-height: 1.17;\n  border-radius: 4px;\n  padding: 14px 19px;\n  background-color: #E6F6F9;\n}\n.edit_proxy .section_wrapper .message_wrapper .message.active {\n  display: block;\n}\n.edit_proxy .section_wrapper .message_wrapper .message.error {\n  display: block;\n  background-color: #ffebeb;\n  color: #eb3a28;\n}\n.modal-backdrop.fade.in {\n  opacity: 0.15;\n}\n.intro {\n  text-align: center;\n  margin-top: 40px;\n}\n.intro .header {\n  margin: auto;\n  width: 600px;\n}\n.intro .sub_header {\n  margin: auto;\n  margin-top: 10px;\n}\n.intro .img_intro {\n  background: url(/img/lpm_infographics.png);\n  width: 592px;\n  height: 326px;\n  margin: 15px 0;\n}\n.intro .section {\n  cursor: pointer;\n  text-align: initial;\n  width: 470px;\n  height: 83px;\n  margin: auto;\n  border: 2px solid #05bed1;\n  box-shadow: 0 2px 2px 0 rgba(156, 181, 190, 0.57);\n  border-radius: 4px;\n  margin-top: 20px;\n  margin-bottom: 20px;\n  padding-top: 17px;\n}\n.intro .section .img_block {\n  position: absolute;\n}\n.intro .section .img_block .circle_wrapper {\n  border: 1px solid #05bed1;\n  width: 20px;\n  height: 20px;\n  position: relative;\n  border-radius: 50%;\n  left: 19px;\n  z-index: 1;\n  background-color: white;\n}\n.intro .section .text_block {\n  display: inline-block;\n  position: relative;\n  left: 110px;\n}\n.intro .section .title {\n  font-size: 22px;\n  font-weight: 700;\n}\n.intro .section .subtitle {\n  font-size: 14px;\n  color: #05bed1;\n}\n.intro .section .right_arrow {\n  width: 14px;\n  height: 14px;\n  position: relative;\n  top: -32px;\n  left: 425px;\n  transform: rotate(45deg);\n  border-top: 2px solid #05bed1;\n  border-right: 2px solid #05bed1;\n}\n.intro .section.disabled {\n  cursor: initial;\n  border: solid 1px #E0E9EE;\n  color: #9cb5be;\n}\n.intro .section.disabled .subtitle {\n  color: #9cb5be;\n}\n.intro .section.disabled .right_arrow {\n  border-color: #9cb5be;\n}\n.intro .section_list {\n  counter-reset: section;\n}\n.intro .img {\n  width: 40px;\n  height: 40px;\n  position: relative;\n  left: 30px;\n  top: -18px;\n}\n.intro .img:before {\n  color: #05bed1;\n  counter-increment: section;\n  content: counters(section, \".\");\n  font-size: 12px;\n  position: absolute;\n  left: -4px;\n  top: -4px;\n  z-index: 2;\n}\n.intro .img_1_active {\n  background: url(/img/1_active.svg);\n}\n.intro .img_2 {\n  background: url(/img/2.svg);\n}\n.intro .img_2_active {\n  background: url(/img/2_active.svg);\n}\n.intro .img_3 {\n  background: url(/img/3.svg);\n}\n.intro .img_3_active {\n  background: url(/img/3_active.svg);\n}\n.intro .howto {\n  width: 537px;\n  margin: auto;\n  margin-bottom: 100px;\n}\n.intro .howto h1.sub_header {\n  line-height: 0;\n  margin: 0 0 25px 0;\n  color: #05bed1;\n}\n.intro .howto .choices {\n  height: 140px;\n}\n.intro .howto .choice {\n  cursor: pointer;\n  display: inline-block;\n  width: 205px;\n  height: 83px;\n  border-radius: 4px;\n  box-shadow: 0 2px 2px 0 #ccdbe3;\n  border: solid 1px #E0E9EE;\n  margin: 30px 20px;\n}\n.intro .howto .choice .content {\n  position: relative;\n  top: 14px;\n}\n.intro .howto .choice .text_smaller {\n  font-size: 14px;\n}\n.intro .howto .choice .text_bigger {\n  font-size: 20px;\n  font-weight: bold;\n}\n.intro .howto .choice.active,\n.intro .howto .choice:hover {\n  border: solid 2px #00aac3;\n  margin-top: 29px;\n}\n.intro .howto .text_middle {\n  display: inline-block;\n  font-size: 17px;\n  font-weight: bold;\n}\n.intro .howto .well {\n  text-align: left;\n  box-shadow: none;\n  border-radius: 3px;\n  background-color: #f5f5f5;\n}\n.intro .howto .browser_instructions .header_well {\n  font-size: 14px;\n  font-weight: bold;\n}\n.intro .howto .browser_instructions .header_well p {\n  margin: 10px;\n  display: inline-block;\n}\n.intro .howto .browser_instructions .header_well select {\n  width: 270px;\n  float: right;\n}\n.intro .howto .code_instructions .header_well {\n  text-align: center;\n}\n.intro .howto .instructions_well {\n  margin-top: 25px;\n  margin-bottom: 25px;\n  position: relative;\n}\n.intro .howto .instructions_well pre {\n  border: none;\n  font-size: 12px;\n  background-color: #E6F6F9;\n}\n.intro .howto .instructions_well pre .btn_copy {\n  position: absolute;\n  top: 28px;\n  right: 28px;\n}\n.intro .howto .btn_lang {\n  margin: 0 2px;\n}\n.intro .howto .btn_done {\n  float: right;\n}\n.intro .howto .instructions {\n  margin-left: 30px;\n  border-left: 1px solid #05bed1;\n}\n.intro .howto .instructions .single_instruction {\n  font-size: 14px;\n  padding-left: 23px;\n  position: relative;\n  top: 2px;\n}\n.intro .howto .instructions ul {\n  margin: 0;\n}\n.intro .howto .instructions ol {\n  counter-reset: section;\n  list-style-type: none;\n  padding-left: 0;\n}\n.intro .howto .instructions li {\n  padding-bottom: 12px;\n}\n.intro .howto .instructions ol li .circle_wrapper {\n  position: absolute;\n  left: 37px;\n  background-color: #f5f5f5;\n  height: 28px;\n  display: inline-block;\n}\n.intro .howto .instructions ol li .circle {\n  border: 1px solid #00bcd2;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  position: relative;\n  top: 3px;\n  left: 1px;\n}\n.intro .howto .instructions ol li:last-child {\n  padding-bottom: 0;\n}\n.intro .howto .instructions ol li .circle:before {\n  counter-increment: section;\n  content: counters(section, \".\");\n  display: inline-block;\n  font-size: 11px;\n  color: #00bcd2;\n  margin-top: 3px;\n  text-align: center;\n  font-weight: 600;\n  position: relative;\n  left: 7px;\n  top: -5px;\n}\n.intro .howto .instructions code {\n  font-family: Lato;\n  font-size: 13px;\n  font-weight: bold;\n  letter-spacing: -0.1px;\n  border-radius: 3px;\n  background-color: #e7f9fa;\n  color: #005271;\n  padding: 3px 10px;\n  margin: 0 5px;\n}\n.add_proxy_modal.modal .modal-content .icon {\n  position: absolute;\n  width: 26px;\n  height: 26px;\n}\n.add_proxy_modal.modal .modal-content .zone_icon {\n  background: url(/img/zone_icon.png);\n}\n.add_proxy_modal.modal .modal-content .preset_icon {\n  background: url(/img/preset_icon.png);\n}\n.add_proxy_modal.modal .modal-content .modal-footer button {\n  margin: 10px 16px;\n}\n.add_proxy_modal.modal .modal-content .modal-footer button.options {\n  width: 190px;\n}\n.add_proxy_modal.modal .modal-content .section {\n  margin-bottom: 37px;\n}\n.add_proxy_modal.modal .modal-content .section:last-child {\n  margin-bottom: 10px;\n}\n.add_proxy_modal.modal .modal-content .section h4 {\n  color: #05bed1;\n  font-weight: bold;\n  font-size: 20px;\n  letter-spacing: 0.5px;\n  position: relative;\n  left: 50px;\n  top: 3px;\n}\n.add_proxy_modal.modal .modal-content .section select {\n  margin-top: 25px;\n}\n.add_proxy_modal.modal .modal-content .preview {\n  margin-top: 15px;\n  border: solid 1px #ccdbe3;\n  padding: 20px 30px;\n  border-radius: 4px;\n}\n.add_proxy_modal.modal .modal-content .preview .header {\n  height: 30px;\n  font-size: 16px;\n  font-weight: bold;\n}\n.add_proxy_modal.modal .modal-content .preview .desc {\n  font-size: 14px;\n  line-height: 1.3;\n  margin-bottom: 12px;\n}\n.add_proxy_modal.modal .modal-content ul {\n  padding-left: 0;\n}\n.add_proxy_modal.modal .modal-content ul li {\n  list-style: none;\n}\n.add_proxy_modal.modal .modal-content ul li::before {\n  color: #05bed1;\n  content: \"\\2022\";\n  font-size: 26px;\n  padding-right: 6px;\n  position: relative;\n  top: 2px;\n}\n.nav_left {\n  margin-top: -30px;\n  position: absolute;\n  width: 224px;\n  height: 100%;\n}\n.nav_left .menu {\n  background-color: #E6F6F9;\n  padding-top: 11px;\n}\n.nav_left .menu .menu_item {\n  background-color: #E6F6F9;\n  height: 40px;\n  position: relative;\n  cursor: pointer;\n}\n.nav_left .menu .menu_item .text {\n  color: #05bed1;\n  height: 22px;\n  position: absolute;\n  top: 50%;\n  margin-top: -11px;\n  left: 60px;\n  font-size: 14px;\n}\n.nav_left .menu .menu_item.active {\n  background-color: #B4E6EE;\n  cursor: default;\n}\n.nav_left .menu .menu_item.active .text {\n  color: #004d74;\n}\n.nav_left .menu .icon {\n  width: 20px;\n  height: 20px;\n  position: relative;\n  top: 10px;\n  left: 20px;\n}\n.nav_left .menu .howto {\n  background-image: url('img/howto.svg');\n}\n.nav_left .menu .proxies {\n  background-image: url('img/proxies.svg');\n}\n.nav_left .menu .stats {\n  background-image: url('img/stats.svg');\n}\n.nav_left .menu .zones {\n  background-image: url('img/zones.svg');\n}\n.nav_left .menu .tester {\n  background-image: url('img/tester.svg');\n}\n.nav_left .menu .tools {\n  background-image: url('img/tools.svg');\n}\n.nav_left .menu .faq {\n  background-image: url('img/faq.svg');\n}\n.nav_left .menu_filler {\n  background-color: #F3FBFC;\n  height: 100%;\n}\n.nav_top {\n  margin-bottom: 30px;\n  background-color: #f5f5f5;\n  height: 60px;\n}\n.nav_top .logo_wrapper {\n  height: 60px;\n  width: 224px;\n  background: white;\n  display: inline-block;\n}\n.nav_top .logo {\n  background-image: url('img/luminati_logo_2.svg');\n  width: 166px;\n  height: 35px;\n  position: relative;\n  top: 8px;\n  left: 24px;\n}\n.nav_top .version {\n  font-size: 9px;\n  font-weight: bold;\n  float: right;\n  position: relative;\n  top: 4px;\n  right: 3px;\n  opacity: 0.5;\n}\n.nav_top .dropdown {\n  float: right;\n  margin: 18px 36px 0 0;\n  font-size: 14px;\n}\n.nav_top .dropdown-toggle {\n  color: #004d74;\n  padding: 3px 17px 3px 5px;\n  position: relative;\n  text-decoration: none;\n}\n.nav_top .dropdown-toggle .caret {\n  position: absolute;\n  right: 6px;\n  top: 12px;\n  margin: 0;\n}\n.nav_top .dropdown-menu li a {\n  color: #004d74;\n  text-decoration: none;\n}\n", ""]);

// exports


/***/ }),

/***/ 728:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if (("function" !== "undefined" && __webpack_require__(729) !== null) && (__webpack_require__(730) !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
    return saveAs;
  }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ 729:
/***/ (function(module, exports) {

module.exports = function() {
	throw new Error("define cannot be used indirect");
};


/***/ }),

/***/ 730:
/***/ (function(module, exports) {

/* WEBPACK VAR INJECTION */(function(__webpack_amd_options__) {/* globals __webpack_amd_options__ */
module.exports = __webpack_amd_options__;

/* WEBPACK VAR INJECTION */}.call(exports, {}))

/***/ }),

/***/ 98:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// LICENSE_CODE ZON ISC
 /*jslint react:true*/

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.StatusCodeTable = exports.StatusCodeRow = exports.status_codes = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _regeneratorRuntime = __webpack_require__(35);

var _regeneratorRuntime2 = _interopRequireDefault(_regeneratorRuntime);

var _react = __webpack_require__(0);

var _react2 = _interopRequireDefault(_react);

var _reactBootstrap = __webpack_require__(39);

var _etask = __webpack_require__(33);

var _etask2 = _interopRequireDefault(_etask);

var _util = __webpack_require__(47);

var _util2 = _interopRequireDefault(_util);

var _common = __webpack_require__(63);

var _common2 = _interopRequireDefault(_common);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var E = {
    install: function install() {
        return E.sp = (0, _etask2.default)('status_codes', [function () {
            return this.wait();
        }]);
    },
    uninstall: function uninstall() {
        if (E.sp) E.sp.return();
    }
};

var status_codes = {
    200: 'OK',
    201: 'Created',
    202: 'Accepted',
    203: 'Non-Authoritative Information',
    204: 'No Content',
    205: 'Reset Content',
    206: 'Partial Content',
    300: 'Multiple Choices',
    301: 'Moved Permanently',
    302: 'Found',
    303: 'See Other',
    304: 'Not Modified',
    305: 'Use Proxy',
    307: 'Temporary Redirect',
    400: 'Bad Request',
    401: 'Unauthorized',
    402: 'Payment Required',
    403: 'Forbidden',
    404: 'Not Found',
    405: 'Method Not Allowed',
    406: 'Not Acceptable',
    407: 'Proxy Authentication Required',
    408: 'Request Timeout',
    409: 'Conflict',
    410: 'Gone',
    411: 'Length Required',
    412: 'Precondition Failed',
    413: 'Request Entity Too Large',
    414: 'Request-URI Too Long',
    415: 'Unsupported Media Type',
    416: 'Requested Range Not Satisfiable',
    417: 'Expectation Failed',
    500: 'Internal Server Error',
    501: 'Not Implemented',
    502: 'Bad Gateway',
    503: 'Service Unavailable',
    504: 'Gateway Timeout',
    505: 'HTTP Version Not Supported'
};

var StatusCodeRow = function (_React$Component) {
    _inherits(StatusCodeRow, _React$Component);

    function StatusCodeRow() {
        _classCallCheck(this, StatusCodeRow);

        return _possibleConstructorReturn(this, (StatusCodeRow.__proto__ || Object.getPrototypeOf(StatusCodeRow)).apply(this, arguments));
    }

    _createClass(StatusCodeRow, [{
        key: 'render',
        value: function render() {
            var _this3 = this;

            var tooltip = _react2.default.createElement(
                _reactBootstrap.Tooltip,
                {
                    id: 'status_code_' + this.props.stat.status_code },
                status_codes[this.props.stat.status_code] || this.props.stat.status_code
            );
            var class_name = '';
            var click = function click() {};
            if (this.props.go) {
                click = function click() {
                    return window.location = _this3.props.path + '/' + _this3.props.stat.status_code;
                };
                class_name = 'row_clickable';
            }
            return _react2.default.createElement(
                'tr',
                { className: class_name, onClick: click },
                _react2.default.createElement(
                    _reactBootstrap.OverlayTrigger,
                    { overlay: tooltip, placement: 'top' },
                    _react2.default.createElement(
                        'td',
                        null,
                        _react2.default.createElement(
                            'a',
                            { href: this.props.path + '/' + this.props.stat.status_code },
                            this.props.stat.status_code
                        )
                    )
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_bw },
                    _util2.default.bytes_format(this.props.stat.bw)
                ),
                _react2.default.createElement(
                    'td',
                    { className: this.props.class_value },
                    this.props.stat.value
                )
            );
        }
    }]);

    return StatusCodeRow;
}(_react2.default.Component);

var StatusCodeTable = function (_React$Component2) {
    _inherits(StatusCodeTable, _React$Component2);

    function StatusCodeTable() {
        _classCallCheck(this, StatusCodeTable);

        return _possibleConstructorReturn(this, (StatusCodeTable.__proto__ || Object.getPrototypeOf(StatusCodeTable)).apply(this, arguments));
    }

    _createClass(StatusCodeTable, [{
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                _common2.default.StatTable,
                _extends({ row: StatusCodeRow, path: '/status_codes',
                    row_key: 'status_code', go: true }, this.props),
                _react2.default.createElement(
                    'tr',
                    null,
                    _react2.default.createElement(
                        'th',
                        null,
                        'Status Code'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-2' },
                        'Bandwidth'
                    ),
                    _react2.default.createElement(
                        'th',
                        { className: 'col-md-5' },
                        'Number of requests'
                    )
                )
            );
        }
    }]);

    return StatusCodeTable;
}(_react2.default.Component);

var Stats = function (_React$Component3) {
    _inherits(Stats, _React$Component3);

    function Stats(props) {
        _classCallCheck(this, Stats);

        var _this5 = _possibleConstructorReturn(this, (Stats.__proto__ || Object.getPrototypeOf(Stats)).call(this, props));

        _this5.state = { stats: [] };
        return _this5;
    }

    _createClass(Stats, [{
        key: 'componentDidMount',
        value: function componentDidMount() {
            E.install();
            var _this = this;
            E.sp.spawn((0, _etask2.default)( /*#__PURE__*/_regeneratorRuntime2.default.mark(function _callee() {
                var res;
                return _regeneratorRuntime2.default.wrap(function _callee$(_context) {
                    while (1) {
                        switch (_context.prev = _context.next) {
                            case 0:
                                _context.next = 2;
                                return _common2.default.StatsService.get_all({ sort: 1,
                                    by: 'status_code' });

                            case 2:
                                res = _context.sent;

                                _this.setState({ stats: res });

                            case 4:
                            case 'end':
                                return _context.stop();
                        }
                    }
                }, _callee, this);
            })));
        }
    }, {
        key: 'componentWillUnmount',
        value: function componentWillUnmount() {
            E.uninstall();
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2.default.createElement(
                'div',
                null,
                _react2.default.createElement(
                    'div',
                    { className: 'page-header' },
                    _react2.default.createElement(
                        'h3',
                        null,
                        'Status codes'
                    )
                ),
                _react2.default.createElement(StatusCodeTable, { stats: this.state.stats })
            );
        }
    }]);

    return Stats;
}(_react2.default.Component);

exports.status_codes = status_codes;
exports.StatusCodeRow = StatusCodeRow;
exports.StatusCodeTable = StatusCodeTable;
exports.default = Stats;

/***/ })

},[362]);