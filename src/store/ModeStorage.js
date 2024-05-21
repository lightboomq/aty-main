import { makeAutoObservable } from 'mobx';

class ModeStorage {
    constructor() {
        this.flagTheme = false;
        this.theme = 'systemMode';

        makeAutoObservable(this, {}, { autoBind: true });
    }
    setDarkMode() {
        this.theme = 'darkMode';
    }
    setSystemMode() {
        this.theme = 'systemMode';
    }
    
    setFlagTheme(){
        this.flagTheme = !this.flagTheme
    }
}

export default new ModeStorage();
