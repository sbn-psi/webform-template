const nodemailer = require('nodemailer');
const subscribers = [
    'mdrum@psi.edu',
    'jstone@psi.edu',
    'neese@psi.edu'
]

const smtpConfig = {
    host: 'email.psi.edu',
    port: 25,
    secure: false
};
const transporter = nodemailer.createTransport(smtpConfig);

const from = 'PDS <noreply@psi.edu>';
const formatTable = function(mod) {
    const utcDate = mod.startDate;
    return `
    <table cellspacing=”0” cellpadding=”20”>
        <tr>
            <th align="left">Name: </th><td>${mod.name}</td>
        </tr>
        <tr>
            <th align="left">Version: </th><td>${mod.version}</td>
        </tr>
        <tr>
            <th align="left">Start Date: </th><td>${utcDate.getUTCFullYear()}-${utcDate.getUTCMonth() + 1}-${utcDate.getUTCDate()}</td>
        </tr>
    </table>`
}

module.exports = {
    confirm: function(mod) {
        let message = {
            from: from,
            to: subscribers.join(', '),
            subject: '[CSS] New Software Registration Notificaiton',
            text: 'A new entry has been added on the Catalina Sky Survey software registration system. ',
            html:
            `<body>
                <h2>[CSS] New Software Registration Notificaiton</h2>
                <p>A new entry has been added on the Catalina Sky Survey software registration system. Details below:</p>
                ${formatTable(mod)}
            </body>`
        }

        transporter.sendMail(message, function(err, info) {
            console.log(err);
        });
    }
}