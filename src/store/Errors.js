import { makeAutoObservable } from 'mobx';

class Errors{
    constructor(){
        this.message = '';
        makeAutoObservable(this, {}, { autoBind: true });
    }
    getMessage(){
        return this.message;
    }
    setMessage(err){
        this.message = err;
    }
}
export default new Errors();