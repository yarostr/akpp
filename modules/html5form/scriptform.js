$(document).ready(function () {
  $(".infochek input:checkbox").bind("change click", function () {
    if ($(this).prop("checked")) {
      $(this).parents("form").find("button").prop("disabled", false);
    } else {
      $(this).parents("form").find("button").prop("disabled", true);
    }
  });

  $(".htmlform").submit(function () {
    var div = document.createElement("div");
    div.className = "otpravka";
    div.onclick = function () {
      code = this.remove();
      eval(code);
    };
    div.innerHTML = "<div class='massage'>Ваше письмо отправляется...</div>";
    document.body.append(div);
    var part = $(this).data("part");
    var form = document.forms["sendform" + part],
      formData = new FormData(form),
      xhr = new XMLHttpRequest();
    xhr.open("POST", $(this).data("act"));
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var otvet = xhr.responseText.split("<!DOCTYPE html>")[0];
        console.log("Ответ: " + otvet);
        if (otvet == "Письмо успешно отправлено") {
          if ($("#sendform" + part).data("redir")) {
            window.location.href = $("#sendform" + part).data("redir");
          } else {
            $(".otpravka .massage").html($("#sendform" + part).data("message"));
            $("#sendform" + part)[0].reset();
            var ssel = $("#sendform" + part).data("sel");
            var cclass = $("#sendform" + part).data("class");
            if (ssel && cclass) {
              $(ssel).removeClass(cclass);
            }
          }
        } else {
          $(".otpravka .massage").html("Произошла ошибка отправки");
        }
      }
    };
    var kolvo = $("#sendform" + part + " .object").length;
    for (i = 1; i <= kolvo; i++) {
      var tip_el = "",
        nam_el = "",
        zn_el = "";
      tip_el = $("#sendform" + part + " .object.object" + i).attr("data-tip");
      nam_el = $("#sendform" + part + " .object.object" + i).attr("data-text");
      switch (tip_el) {
        case "stroka":
          zn_el = $("#sendform" + part + " .object.object" + i)
            .find("input")
            .val();
          break;
        case "stroka_tel":
          zn_el = $("#sendform" + part + " .object.object" + i)
            .find("input")
            .val();
          break;
        case "spisok":
          zn_el = $("#sendform" + part + " .object.object" + i)
            .find("select option:selected")
            .val();
          break;
        case "pole":
          zn_el = $("#sendform" + part + " .object.object" + i)
            .find("textarea")
            .val();
          break;
        case "fileattach":
          zn_el = $("#sendform" + part + " .object.object" + i)
            .find("input")
            .prop("files")[0];
          if (!!zn_el) {
            zn_el = zn_el.name;
          } else {
            zn_el = "";
          }
          break;
      }
      formData.append("text" + i, nam_el);
      formData.append("znach" + i, zn_el);
      formData.append("tip" + i, tip_el);
    }
    var filekolvo = 0;
    for (
      j = 0;
      j < $("#sendform" + part + ' .object input[type="file"]').length;
      j++
    ) {
      var namfa = $("#sendform" + part + ' .object input[type="file"]')
        .eq(j)
        .attr("name");
      if (!!namfa) {
        formData.append("file" + j, namfa);
        filekolvo = filekolvo + 1;
      }
    }
    formData.append("filekolvo", filekolvo);

    formData.append("kolvo", kolvo);
    formData.append("part", part);
    formData.append("sendMessages", "sm");
    formData.append("link", window.location.href);
    xhr.send(formData);
    return false;
  });
});
