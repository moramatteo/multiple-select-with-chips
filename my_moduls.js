class select {
  constructor(querySelector, data, config) {
    try {
      this.select_name = querySelector;

      var all_value = [];
      var html_options = this.create_options(data);
      var html_content = `<div class="selected">
                      <div class="chips">`;
      for (var i = 0; i < data.length; i++) {
        //controlla se non mancano nè il testo nè il valore
        if (data[i].text == undefined || data[i].text == "")
          throw `Non è stato impostato nessun testo per il valore "${data[i].value}"`;
        if (data[i].value == undefined || data[i].value == "")
          throw `Non è stato impostato nessun valore per il testo "${data[i].text}"`;

        //controlla se non ci sono valori duplicati
        if (all_value.includes(data[i].value))
          throw "Ci sono dei valori duplicati";
        else all_value.push(data[i].value);

        if (data[i].select == true) {
          html_content += `<div value="${data[i].value}">
        <span class="delete-chip" value="${data[i].value}" onclick="delete_chip($(this).attr('value'))">X</span>
          <span>${data[i].text}</span>
        </div>`;
        }
      }
      html_content +=
        `</div>
        <input type="text" class="text-input mousetrap" placeholder="Cerca"
        onfocus="show_options_list($(this).attr('select_name'))" select_name="${querySelector}"
        onkeyup="options_filter(this.value)">
      </div>
      ` + html_options;
      $(`[select_name=${querySelector}]`).append(html_content);

      if (config.add_personal_chip == false) {
        $(
          `[select_name=${querySelector}] > .selected > .text-input`
        ).removeClass("mousetrap");
      }
    } catch (error) {
      alert(`errore nel selettore chiamato "${this.select_name}"\n${error}`);
    }
  }

  create_options(data) {
    var html_content = `<div class="options-list hide">`;
    for (var i = 0; i < data.length; i++) {
      if (data[i].select == true) {
        html_content += `<div class="option select" value="${data[i].value}" onclick="add_chip(this, $(this).first(), $(this).attr('value'))">`;
      } else {
        html_content += `<div class="option" value="${data[i].value}" onclick="add_chip(this, $(this).first(), $(this).attr('value'))">`;
      }
      html_content += `
          <div class="option-text">${data[i].text}</div>
          <div class="check-mark">
            <span class="material-icons-outlined">close</span>
          </div>
        </div>`;
    }
    html_content += `</div>`;
    return html_content;
  }

  //aggiunge nuove opzioni
  new_data(data, mod) {
    //esistono 2 modi per aggiungere nuovi opzioni:
    // 1) mod == "replace" --> cancella tutte le altre opzioni già esistenti (DEFAULT)
    // 2) mod == "add" --> aggiunge le nuovi opzioni alla fine di quelle già esistenti
    if (!mod) mod = "replace";

    var html_content = this.create_options(data);

    if (mod == "replace") {
      $(`[select_name=${this.select_name}]  > .options-list`).replaceWith(
        html_content
      );
      $(
        `[select_name=${this.select_name}] > .selected > .chips > div`
      ).remove();
    }
    if (mod == "add")
      $(`[select_name=${this.select_name}]  > .options-list`).append(
        html_content
      );
  }

  get_value() {
    var tot_values = [];
    var children_number = $(
      `[select_name=${this.select_name}] > .selected > .chips`
    ).children().length;
    for (var i = 1; i < children_number + 1; i++) {
      var val = $(
        `[select_name=${this.select_name}] > .selected > .chips > div:nth-child(${i})`
      ).attr("value");
      tot_values.push(val);
    }
    return tot_values;
  }
}
