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
        translateBtn.onclick = () => this.translate(aaInput.value)
    }

    translate(aaSequence){
        alert(aaSequence)
    }
}

window.customElements.define('aa-to-dna-translator', AaToDnaTranlator)