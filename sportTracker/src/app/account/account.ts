export class Account {
    id: number;
    name: string;
    surname: string;
    mdp: string;
    email: string;
    verify: boolean;
    rights: number;

    //Retourne le nom complet
    public getFullName() : String {
        return this.surname + " " + this.name;
    }

    public isAdmin() : boolean {
        return this.rights == 1;
    }

    public getType() : String {
        var resultat = "";
        switch(this.rights){
            case 0 : 
                resultat = "Compte SMT";
                break;
            case 1 :
                resultat = "Compte Adminitrateur";
                break;
            default : 
                resultat = "";
                break;
        }
        return resultat;
    }
}