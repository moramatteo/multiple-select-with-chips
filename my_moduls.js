class select {
  constructor(querySelector, data, config) {
    this.select_name = querySelector;
    try {
      data_validator(this.select_name, data, "constructor");
      var html_chips = this.create_chips(data);
      var html_content = `<div class="selected">
      <div class="chips">
        ${html_chips}
      </div>
      <input type="text" class="text-input mousetrap" placeholder="Cerca"
      onfocus="show_options_list($(this).attr('select_name'))" select_name="${querySelector}"
      onkeyup="options_filter(this.value)">
    </div>
    <div class="options-list hide">
      ${this.create_options(data)}
    </div>`;

      $(`[select_name=${querySelector}]`).append(html_content);

      if (config.add_personal_chip == false) {
        $(
          `[select_name=${querySelector}] .text-input`
        ).removeClass("mousetrap");
      }

      set_input_with();
    } catch (error) {
      alert(`errore nel selettore chiamato "${this.select_name}"\n${error}`);
      $(`[select_name=${querySelector}]`).append(
        "errore nell'inserimento delle opzioni"
      );
    }
  }

  // creates the HTML content of the chips in case there are pre-selected elements on loading
  create_chips(data) {
    var html_content = ``;
    for (var i = 0; i < data.length; i++) {
      if (data[i].select == true) {
        html_content += `<div value="${data[i].value}">
              <span class="delete-chip" value="${data[i].value}" onclick="delete_chip($(this).attr('value'))">X</span>
              <span>${data[i].text}</span>
            </div>`;
      }
    }
    return html_content;
  }

  //creates the HTML content of the options
  create_options(data) {
    var html_content = "";
    for (var i = 0; i < data.length; i++) {
      if (data[i].select == true) {
        html_content += `<div class="option select" value="${data[i].value}" onclick="delete_chip($(this).attr('value'))">`;
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
    return html_content;
  }

  //adds new options
  new_data(data, mod) {
    // there are 2 ways to add new options:
    // 1) mod == "replace" -> delete all other already existing options (DEFAULT)
    // 2) mod == "add" -> adds new options to the end of existing ones
    if (!mod) mod = "replace";

    try {
      data_validator(this.select_name, data, mod);
      var html_chips = this.create_chips(data);
      var html_options = this.create_options(data);
      if (mod == "replace") {
        $(`[select_name=${this.select_name}] .options-list`).replaceWith(
          '<div class="options-list hide">' + html_options + "</div>"
        );

        $(
          `[select_name=${this.select_name}] .chips > div`
        ).remove();
        $(`[select_name=${this.select_name}] .chips`).append(
          ` ${html_chips} `
        );
      }
      if (mod == "add") {
        $(`[select_name=${this.select_name}] .options-list`).append(
          html_options
        );
        $(`[select_name=${this.select_name}] .chips`).append(
          ` ${html_chips} `
        );
      }
    } catch (error) {
      alert(`errore nel selettore chiamato "${this.select_name}"\n${error}`);
      $(`[select_name=${this.select_name}]`).replaceWith(
        "errore nell'inserimento delle opzioni"
      );
    }
  }

  get_value() {
    var selected_info = {
      all: this.check_all_selected(),
      names: [],
      values: [],
    };
    var chips_number = $(
      `[select_name=${this.select_name}] .chips`
    ).children().length;
    for (var i = 1; i < chips_number + 1; i++) {
      var val = $(
        `[select_name=${this.select_name}] .chips > div:nth-child(${i})`
      ).attr("value");
      selected_info.values.push(val);

      var text = $(
        `[select_name=${this.select_name}] .chips > div:nth-child(${i}) > span:nth-child(2)`
      ).html();
      selected_info.names.push(text);
    }
    return selected_info;
  }

  check_all_selected() {
    var all_selected = true;
    var options_number = $(
      `[select_name=${this.select_name}] .options-list`
    ).children().length;
    for (var i = 1; i < options_number + 1; i++) {
      var div_in_use = `[select_name=${this.select_name}] .options-list > div:nth-child(${i})`;
      if ($(div_in_use).hasClass("select") == false) {
        all_selected = false;
        break;
      }
    }
    return all_selected;
  }
}

function select_all() {
  var options_number = $(
    `[select_name=${select_name}] .options-list`
  ).children().length;
  for (var i = 1; i < options_number + 1; i++) {
    var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
    if ($(div_in_use).hasClass("select") == true) {
      continue;
    } else {
      add_chip(
        $(div_in_use),
        $(div_in_use).first(),
        $(div_in_use).attr("value")
      );
    }
  }
}

function deselect_all(forced) {
  var options_number = $(
    `[select_name=${select_name}] .options-list`
  ).children().length;
  for (var i = 1; i < options_number + 1; i++) {
    var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
    if ($(div_in_use).hasClass("select") == false) {
      continue;
    } else {
      delete_chip($(div_in_use).attr("value"));
    }
  }
  if (forced == "forced") {
    $(`[select_name=${select_name}] .chips > div`).remove();
  }
}

function data_validator(select_name, data, mod) {
  var all_value = [];

  if (mod == "enter") {
    //chips check
    var chips_number = $(
      `[select_name=${select_name}] .chips`
    ).children().length;
    for (var i = 1; i < chips_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .chips > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
      if (all_value.includes(data)) {
        throw "valore già selezionato";
      }
    }

    //options' value check
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    for (var i = 1; i < options_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
      if (all_value.includes(data)) {
        throw "c'è già una opzione con questo valore";
      }
    }
  }

  if (mod == "constructor" || mod == "replace") {
    for (var i = 0; i < data.length; i++) {
      //check if neither the text nor the value are missing
      if (data[i].text == undefined || data[i].text == "")
        throw `Non è stato impostato nessun testo per il valore "${data[i].value}"`;
      if (data[i].value == undefined || data[i].value == "")
        throw `Non è stato impostato nessun valore per il testo "${data[i].text}"`;

      //check if there are no duplicate values
      if (all_value.includes(data[i].value))
        throw "Ci sono dei valori duplicati";
      else all_value.push(data[i].value);
    }
  }

  if (mod == "add") {
    data_validator(select_name, data, "replace");

    //aggiunge all'array tutti chips
    var chips_number = $(
      `[select_name=${select_name}] .chips`
    ).children().length;
    for (var i = 1; i < chips_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .chips > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
    }

    //aggiunge all'array tutti i valori delle opzioni
    var options_number = $(
      `[select_name=${select_name}] .options-list`
    ).children().length;
    for (var i = 1; i < options_number + 1; i++) {
      var div_in_use = `[select_name=${select_name}] .options-list > div:nth-child(${i})`;
      var val = $(div_in_use).attr("value");
      all_value.push(val);
    }

    //controlla se ogni valore è presente nell'array
    for (var i = 0; i < data.length; i++) {
      if (all_value.includes(data[i].value)) {
        throw "Ci sono dei valori duplicati";
      }
    }
  }
}
