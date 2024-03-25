export const TrashCategories: TrashCategories = {
    paper: {
        paper: "Papier",
    },
    plastic: {
        plastic: "Plastik",
        paperCup: "Papp-Becher",
        tetraPak: "Tetra Pak",
    },
    trash: {
        biological: "Biologisch",
        receipt: "Kassenzettel",
    },
};

export interface TrashCategories {
    [key: string]: {
        [key: string]: string;
    };
}