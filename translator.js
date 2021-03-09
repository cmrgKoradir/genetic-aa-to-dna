class AaToDnaTranlator extends HTMLElement {
    constructor(){
        super()
        this._shadow = this.attachShadow({mode: 'closed'})
    }

    connectedCallback(){
        const template = `
        <style>
            * {
                box-sizing: border-box;
                padding: 0;
                margin: 0;
            }
            .editor {
                display: flex;
            }
            .aa-input{
                flex-grow:1;
                margin-right:.5em;
            }
        </style>
        <div class="aa-to-dna-translator">
            <div class="editor">
                <input class="aa-input"></input>
                <button class="translate-btn">Translate</button>
            </div>
            <div class="result"></div>
            <div class="visualisation"></div>
        </div>
        `
        this._shadow.innerHTML = template

        const translateBtn = this._shadow.querySelector('.translate-btn')
        const aaInput = this._shadow.querySelector('.aa-input')
        translateBtn.onclick = () => this.findPossibleDNA(aaInput.value)
    }

    static #defaultAa = "X"
    static #dnaToAa = new Map([
        ["TTT", "F"],
        ["TTC", "F"],
        ["TTA", "L"],
        ["TTG", "L"],
        ["TCT", "S"],
        ["TCC", "S"],
        ["TCA", "S"],
        ["TCG", "S"],
        ["TAT", "Y"],
        ["TAC", "Y"],
        ["TAA", "*"],
        ["TAG", "*"],
        ["TGT", "C"],
        ["TGC", "C"],
        ["TGA", "*"],
        ["TGG", "W"],
        ["CTT", "L"],
        ["CTC", "L"],
        ["CTA", "L"],
        ["CTG", "L"],
        ["CCT", "P"],
        ["CCC", "P"],
        ["CCA", "P"],
        ["CCG", "P"],
        ["CAT", "H"],
        ["CAC", "H"],
        ["CAA", "Q"],
        ["CAG", "Q"],
        ["CGT", "R"],
        ["CGC", "R"],
        ["CGA", "R"],
        ["CGG", "R"],
        ["ATT", "I"],
        ["ATC", "I"],
        ["ATA", "I"],
        ["ATG", "M"],
        ["ACT", "T"],
        ["ACC", "T"],
        ["ACA", "T"],
        ["ACG", "T"],
        ["AAT", "N"],
        ["AAC", "N"],
        ["AAA", "K"],
        ["AAG", "K"],
        ["AGT", "S"],
        ["AGC", "S"],
        ["AGA", "R"],
        ["AGG", "R"],
        ["GTT", "V"],
        ["GTC", "V"],
        ["GTA", "V"],
        ["GTG", "V"],
        ["GCT", "A"],
        ["GCC", "A"],
        ["GCA", "A"],
        ["GCG", "A"],
        ["GAT", "D"],
        ["GAC", "D"],
        ["GAA", "E"],
        ["GAG", "E"],
        ["GGT", "G"],
        ["GGC", "G"],
        ["GGA", "G"],
        ["GGG", "G"],
    ])

    findPossibleDNA(aaSequence){
        alert(aaSequence)
    }

    /**
     * @param {string} dna a sequence of dna symbol triplets
     * @returns {string} aa sequence as string
    */
    static dnaToAa(dna){
        if(dna.length % 3 != 0){
            throw 'dna expected to be a multiple of 3 symbols long'
        }

        dna = dna.toUpperCase()

        let result = ""
        for(let i = 0; i <= dna.length -3; i += 3){
            const triplet = [dna[i], dna[i+1], dna[i+2]].join('')
            const aaSymbol = AaToDnaTranlator.#dnaToAa.get(triplet) || AaToDnaTranlator.#defaultAa
            result = result + aaSymbol
        }
        return result
    }
}

window.customElements.define('aa-to-dna-translator', AaToDnaTranlator)