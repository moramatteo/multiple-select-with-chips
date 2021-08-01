class select {
  constructor(querySelector, data) {
    this.querySelector = querySelector;
    var data_format = this.create_options(data);
    $(querySelector).append(
      `
      <div class="selected">
      <div class="chips">
      <div>
      <span class="delete-chip" onclick="delete_chip(this)" >X</span>
      <span>Ciao</span>
      </div>
      </div>
      <input type="text" class="text-input" onfocus="show_options_list()">
      </div>` + data_format
    );
  }

  create_options(data) {
    var data_format = `<div class="options-list hide">`;
    for (var i = 0; i < data.length; i++) {
      data_format += `
        <div class="option" value="${data[i].value}" onclick="add_chip(this.textContent,  $(this).attr('value'))">${data[i].text}</div>`;
    }
    data_format += `</div>`;
    return data_format;
  }

  //aggiunge nuove opzioni
  new_data(data, mod) {
    //esistono 2 modi per aggiungere nuovi opzioni:
    // 1) mod == "replace" --> cancella tutte le altre opzioni già esistenti (DEFAULT)
    // 2) mod == "add" --> aggiunge le nuovi opzioni alla fine di quelle già esistenti
    if (!mod) mod = "replace";

    var data_format = this.create_options(data);

    if (mod == "replace")
      $(this.querySelector + " > .options-list").replaceWith(data_format);
    if (mod == "add")
      $(this.querySelector + " > .options-list").append(data_format);
  }
}

