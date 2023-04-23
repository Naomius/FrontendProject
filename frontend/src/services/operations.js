import config from "../../config/config.js";
import {Auth} from "./auth.js";


export class Operations {
    static refreshTokenKey = 'refreshToken';
    static refreshToken = localStorage.getItem(this.refreshTokenKey);


    static async getOperations(period, dateFrom, dateTo) {
        if (this.refreshToken) {
            if (dateFrom && dateTo && period) {
                const response = await fetch(config.host + '/operations' + '?period=' + period + '&dateFrom=' + dateFrom + '&dateTo=' + dateTo, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': this.refreshToken,
                    },
                });
                if (response && response.status === 200) {
                    const result = await response.json()
                    if (result && !result.error) {
                        return result;
                    }
                }
            } else if (period) {
                const response = await fetch(config.host + '/operations' + '?period=' + period, {
                    method: 'GET',
                    headers: {
                        'x-auth-token': this.refreshToken,
                    },
                });
                if (response && response.status === 200) {
                    const result = await response.json()
                    if (result && !result.error) {
                        return result;
                    }
                }
            }

        }
    }

}