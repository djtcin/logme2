const DateTools = {
    isSameDay: function(d1: Date, d2: Date) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    },
    
    diffInMinutes: function(d1: Date, d2: Date) {
        let differenceValue =(d1.getTime() - d2.getTime()) / 1000;
        differenceValue /= 60;
        return Math.abs(Math.round(differenceValue));
    },
    
    getDecimalTime: function(date: Date) {
        const hour = date.getHours();
        const minute = date.getMinutes();
        return hour + (minute / 60);
    },
    
    getFormatedTime: function(date: Date) {
        const hour = date.getHours();
        const minute = date.getMinutes().toLocaleString('en-US', {minimumIntegerDigits: 2, useGrouping:false});
        return `${hour}:${minute}`;
    },
    
    getFormatedDate: function(date: Date) {
        return date.toLocaleDateString('en-us', { year:"numeric", month:"long", day:"numeric"});
    },
    
    getRoundTo25: function(hours: number) {
        return (Math.round(hours * 4) / 4).toFixed(2);
    },
    
    getLastSunday: function(date: Date) {
        let sunday = new Date(date);
        sunday.setDate(sunday.getDate() - sunday.getDay());
        return sunday;
    },
    
    addDays: function(date: Date, nbDays: number) {
        const d = new Date(date);
        d.setDate(d.getDate() + nbDays);
        return d;
    },
    
    addWeeks: function(date: Date, nbWeeks: number) {
        return DateTools.addDays(date, nbWeeks * 7);
    },
    
    addMonths: function(date: Date, nbMonths: number) {
        const d = new Date(date);
        d.setMonth(d.getMonth() + nbMonths);
        return d;
    }
};

export default DateTools;