export const Converter = (r, b) => {
    let a = [r, b];

    for (let i = 0; i <= 2; i++) {
        if (i === 0) {
            if (a[i] === 1) {
                r = "Single"

            } else if (a[i] === 2) {
                r = "In my Dream I have a Waifu"
            } else if (a[i] === 3) {
                r = "Married - Real One"
            } else if (a[i] === 4) {
                r = "Devorced - Ops Sad"
            } else if (a[i] === 5) {
                r = "I won't say it , May be 1 bitcoin change my mind"
            }

        } else if (i === 1) {
            if (a[i] === 1) {
                b = "AB+"
            } else if (a[i] === 2) {
                b = "AB-"
            } else if (a[i] === 3) {
                b = "O+"
            } else if (a[i] === 4) {
                b = "O-"
            } else if (a[i] === 5) {
                b = "A+"
            } else if (a[i] === 6) {
                b = "A-"
            } else if (a[i] === 7) {
                b = "B+"
            } else if (a[i] === 8) {
                b = "B-"
            } else if (a[i] === 9) {
                b = "Rare"
            } else if (a[i] === 10) {
                b = "Prefer not to Say"
            }

        }
    }

    return {
        r,
        b
    };
}