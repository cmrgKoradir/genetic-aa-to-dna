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

    #defaultAa = "X"
    #dnaToAa = new Map([
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
}

window.customElements.define('aa-to-dna-translator', AaToDnaTranlator)