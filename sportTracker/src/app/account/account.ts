export class Account {
    id: number;
    name: string;
    surname: string;
    mdp: string;
    email: string;

    //Retourne le nom complet
    public getFullName() : String {
        return this.surname + " " + this.name;
    }
}