import moment from 'moment';

const getFormatTime = (time = new Date()) => {
    return moment(time).format('YYYY-MM-DD HH:mm:ss');
}

export {getFormatTime}

