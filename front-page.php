<div class="jumbotron">
  <div class="row">
    <div class="col-sm-6">
      <div class="embed-responsive embed-responsive-16by9" id="video">
        <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/QCkm0lL-6lc?showinfo=0&autohide=1" frameborder="0" allowfullscreen></iframe>
      </div>
    </div>
    <div class="col-sm-6 call-to-action">
      <h2>Annotate with anyone, anywhere</h2>
      <p><a href="https://hypothes.is/about/">Our mission</a> is to bring a new layer to the web. Use Hypothesis to discuss, collaborate, organize your research, or take personal notes.</p>
      <section class="installer">
        <!-- Chrome -->
        <span class="installer__section--chrome">
          <a class="btn btn-primary hidden-xs" href="https://chrome.google.com/webstore/detail/bjfhmglciegochdpefhhlphglcehbmek" onclick="chrome.webstore.install();return false;" data-chromeext-button="">
            <img class="installer__browser-logo--chrome" src="<?php echo get_stylesheet_directory_uri(); ?>/dist/images/browser-chrome-64x64.png" alt="">
            Install
          </a>
        </span>

        <!-- Bookmarklet -->
        <span class="installer__section--bookmarklet">
          <a class="btn btn-primary hidden-xs" href="#" data-toggle="modal" data-target="#bookmarklet">
            Get Bookmarklet
          </a>
        </span>

        <em class="or hidden-xs">Or...</em>

        <!-- Via Widget -->
        <form class="via" onsubmit="url = document.getElementById('search').value; if (url != '') { window.location.href = 'https://via.hypothes.is/h/' + url; } return false;">
          <span class="input-group" title="Insert a URL to annotate that page.">
            <input id="search"
                   class="form-control"
                   type="text"
                   placeholder="Paste a link..."
                   name="search"></input>
            <span class="input-group-btn" data-via-button="">
              <button class="btn btn-primary" type="submit">Annotate!</button>
            </span>
          </span>
        </form>
      </section>

      <!-- Bookmarklet trigger modal -->
      <p class="installer__section--bookmarklet">There's also a <a href="https://chrome.google.com/webstore/detail/bjfhmglciegochdpefhhlphglcehbmek">Chrome extension</a> or you can <a href="#" class="" data-toggle="modal" data-target="#addtoyoursite" data-addtosite-button="">add it to your website</a>.</p>

      <p class="chrome-mobile-only visible-xs-block">There's also a <a href="https://chrome.google.com/webstore/detail/bjfhmglciegochdpefhhlphglcehbmek">Chrome extension</a> or you can <a href="#" class="" data-toggle="modal" data-target="#addtoyoursite" data-addtosite-button="">add it to your website</a>.</p>

      <p class="chrome-desktop-only hidden-xs">There's also a <a href="#" class="" data-toggle="modal" data-target="#bookmarklet">bookmarklet</a> or you can <a href="#" class="" data-toggle="modal" data-target="#addtoyoursite" data-addtosite-button="">add it to your website</a>.</p>

        <!-- Bookmarklet Modal -->
        <div class="modal fade" id="bookmarklet" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <h4 class="modal-title">Bookmarklet</h4>
              </div>
              <div class="modal-body">
                <div class="">
                  <a class="btn btn-primary btn-lg installer__button--draggable"
                     href="javascript:(function(){window.hypothesisConfig=function(){return{showHighlights:true};};var d=document,s=d.createElement('script');s.setAttribute('src','https://hypothes.is/app/embed.js');d.body.appendChild(s)})();"
                     onclick="alert('Drag me to the bookmarks bar');return false;"
                     title="Drag me to the bookmarks bar"
                     data-bookmarklet-button="">Launch Hypothesis</a>
                  <p><i class="fa fa-arrows"></i> Drag the button into your bookmarks bar then click it to launch the Hypothesis application.
                    Alternatively, right click and select "bookmark this link."</p>
                  <p>To load Hypothesis on a webpage or PDF, simply click on the bookmarklet in your bookmarks.</p>
                </div><!-- /.installer__sectionbookmarklet -->
              </div><!-- /.modal-body -->
            </div><!-- /.modal-content -->
          </div><!-- /.modal-dialog -->
        </div><!-- /.modal-fade -->

        <!-- / Add to your site modal -->
        <div class="modal fade" id="addtoyoursite" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
          <div class="modal-dialog">
            <div class="modal-content">
              <div class="modal-header">
                <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">×</span></button>
                <h4 class="modal-title">Add Hypothesis to a web site</h4>
              </div>
              <div class="modal-body">
                <div class="installer__section--addtosite">
                  <p><input class="form-control" type="text" value='&lt;script async defer src="//hypothes.is/embed.js"&gt;&lt;/script&gt;'></input></p>
                  <p>Add the above script tag to your web site's HTML to load the Hypothesis sidebar on your site.</p>
                  <p>To show highlights by default, also add:</p>
                  <p><input class="form-control" type="text" value='&lt;script&gt;window.hypothesisConfig=function(){return{showHighlights:true};&lt;/script&gt;'></input></p>
                  <p>Alternatively, if you use WordPress, checkout the <a href="https://wordpress.org/plugins/hypothesis/">Hypothesis WordPress plugin</a>.
                </div><!-- /.installer__sectionbookmarklet -->
              </div><!-- /.modal-body -->
            </div><!-- /.modal-content -->
          </div><!-- /.modal-dialog -->
        </div><!-- /.modal-fade -->
    </div><!-- /.col -->
  </div><!-- /.row -->
</div><!-- /.jumbotron -->

