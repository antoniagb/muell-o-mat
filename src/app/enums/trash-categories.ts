export const TrashCategories: TrashCategories = {
    paper: {
        paper: "Papier",
    },
    plastic: {
        plastic: "Plastik",
        paperCup: "Papp-Becher",
        tetraPak: "Tetra Pak",
        yoghurt: "Joghurtbecher",
    },
    trash: {
        biological: "Biologisch",
        receipt: "Kassenzettel",
        ballpen: "Kugelschreiber",
    },
};

export interface TrashCategories {
    [key: string]: {
        [key: string]: string;
    };
}