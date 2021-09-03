class select {
  constructor(querySelector, data, config) {
    this.select_name = querySelector;
    if (!config) config = {};
    try {
      if (config.placeholder == undefined) config.placeholder = "Cerca";
      data_validator(this.select_name, data, "constructor");
      var html_chips = this.create_chips(data);
      var html_content = `<div class="selected">
      <div class="chips">
        ${html_chips}
      </div>
      <input type="text" class="text-input add_personal_chip" placeholder="${
        config.placeholder
      }"
      onfocus="show_options_list($(this).attr('select_name'))" select_name="${querySelector}"
      onkeyup="options_filter(this.value)">
    </div>
    <div class="options-list hide">
      ${this.create_options(data)}
    </div>`;

      $(`[select_name=${querySelector}]`).append(html_content);

      //set config options
      if (config.add_personal_chip == false) {
        $(`[select_name=${querySelector}] .text-input`).removeClass(
          "add_personal_chip"
        );
      }
      if (config.autocomplete == false) {
        $(`[select_name=${querySelector}] .text-input`).removeAttr("onkeyup");
      }

      if (typeof config.max_selections == "number")
        select_catalog[this.select_name] = {
          max_selections: config.max_selections,
        };

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
          <span>${data[i].text}</span>
          <span class="delete-chip material-icons" value="${data[i].value}" select_name="${this.select_name}" onclick="${delete_chip_function}">close</span>
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
        html_content += `<div class="option select" value="${data[i].value}" select_name="${this.select_name}" onclick="${delete_chip_function}">`;
      } else {
        html_content += `<div class="option" value="${data[i].value}" select_name="${this.select_name}" onclick="${add_chip_function}">`;
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

        $(`[select_name=${this.select_name}] .chips > div`).remove();
        $(`[select_name=${this.select_name}] .chips`).append(` ${html_chips} `);
      }
      if (mod == "add") {
        $(`[select_name=${this.select_name}] .options-list`).append(
          html_options
        );
        $(`[select_name=${this.select_name}] .chips`).append(` ${html_chips} `);
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
      added_values: [],
    };
    var chips_number = $(`[select_name=${this.select_name}] .chips`).children()
      .length;
    for (var i = 1; i < chips_number + 1; i++) {
      var val = $(
        `[select_name=${this.select_name}] .chips > div:nth-child(${i})`
      ).attr("value");
      selected_info.values.push(val);

      var text = $(
        `[select_name=${this.select_name}] .chips > div:nth-child(${i}) > span:nth-child(2)`
      ).html();
      selected_info.names.push(text);

      if (
        $(`[select_name=${this.select_name}] .options-list > div[value=${val}]`)
          .length == 0
      ) {
        selected_info.added_values.push(val);
      }
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

  //method to call the function without putting the select_name as a parameter
  select_all() {
    select_all(this.select_name);
  }

  //method to call the function without putting the select_name as a parameter
  deselect_all(forced) {
    deselect_all(forced, this.select_name);
  }
}
