import axios from 'axios'

const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1138745750063435807/nfdDfgKcGxd0taIoYS78UoDSCJ3GL219v73QkymtamlPNWykSuOZlG-ykV3fkJ7i8_6d";


const webhook = {
    send: function ({ message }) {
        axios.post(DISCORD_WEBHOOK_URL, {
            "content": message
        });
    }
}

export { webhook }