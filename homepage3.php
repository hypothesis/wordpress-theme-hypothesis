<?php
/*
Template Name: Homepage 3
*/
?>

<div class="jumbotron hypo-tron">
	<div class="container">
		<div class="row">
			<div class="col-sm-6 col-md-6">
				<div class="embed-responsive embed-responsive-16by9" id="video">
					<iframe class="embed-responsive-item" src="https://www.youtube.com/embed/QCkm0lL-6lc?showinfo=0&autohide=1" frameborder="0" allowfullscreen></iframe>
				</div>
			</div>
			<div class="col-sm-6 col-md-6">
				<h2>Annotate with anyone, anywhere</h2>
				<p>Discuss, add additional information, organize your research, or leave personal notes on web pages and PDFs.</p>
				<section class="installer">

					<!-- Chrome -->
			    <span class="installer__section--chrome">
			      <a class="btn btn-primary" href="https://chrome.google.com/webstore/detail/bjfhmglciegochdpefhhlphglcehbmek" onclick="chrome.webstore.install();return false;" data-chromeext-button="">
			        <img class="installer__browser-logo--chrome" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-chrome-64x64.png" alt="">
			        Install
			      </a>

			    </span>
			    
			    <!-- Safari -->
			    <span class="installer__section--safari">
			      <a class="installer__button installer__button--large" href="https://chrome.google.com/webstore/detail/bjfhmglciegochdpefhhlphglcehbmek" data-chromeext-button="">
			        <img class="installer__browser-logo--chrome" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-chrome-64x64.png" alt="">
			        Install Chrome Extension
			      </a>
			    </span>

			    <!-- Firefox -->
			    <span class="installer__section--firefox">
			      <a class="btn btn-primary" href="#" data-bookmarklet-button="">
			      	<img class="installer__browser-logo--firefox" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-firefox-64x64.png" alt="">
			      	Install</a>
			    </span>

				  <em class="or">Or...</em>
				  
				  <!-- Via Widget -->
				  <form class="via" onsubmit="url = document.getElementById('search').value; if (url != '') { document.location.href = '/h/' + url; } return false;">
		        <div class="input-group" title="Insert a URL to annotate that page.">
		        	<input id="search" 
		                 class="form-control" 
		               	 type="text"
		               	 placeholder="Paste a link..." 
		               	 maxsize="30" 
		               	 name="search"></input>
			        <span class="input-group-btn">
			          <button class="btn btn-primary" type="submit">Annotate!</button>
			        </span>
		        </div>
	      	</form>
      	</section>
				
				<!-- Bookmarklet trigger modal -->
				<p class="hypo-small installer__section--bookmarklet">Looking for the <a href="#" class="" data-toggle="modal" data-target="#bookmarklet">bookmarklet</a>?</p>

				<!-- Bookmarklet Modal -->
				<div class="modal fade" id="bookmarklet" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
				        <h4 class="modal-title" id="myModalLabel">Bookmarklet</h4>
				      </div>
				      <div class="modal-body">
				      	<div class="installer__section--bookmarklet">
				      		<a class="btn btn-primary installer__button--draggable" href="javascript:(function(){window.hypothesisConfig=function(){return{showHighlights:true};};var d=document,s=d.createElement('script');s.setAttribute('src','https://hypothes.is/app/embed.js');d.body.appendChild(s)})();" onclick="alert('Drag me to the bookmarks bar');return false;" title="Drag me to the bookmarks bar" data-bookmarklet-button="">
				      			<img class="installer__browser-logo--safari" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-safari-64x64.png" alt="">
				      			<img class="installer__browser-logo--opera" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-opera-64x64.png" alt="">
				      			<img class="installer__browser-logo--ie" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-internet-explorer-64x64.png" alt="">
				      			<img class="installer__browser-logo--firefox" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-firefox-64x64.png" alt="">
				      			<img class="installer__browser-logo--chrome" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-chrome-64x64.png" alt="">
				      			<img class="installer__browser-logo--default" src="http://hypothes.is/wp-content/themes/hypothesis-1.0.11/images/browser-default-64x64.png" alt="">
				      			Launch Hypothesis
				      		</a>
				      		<p class="installer__info"><i class="icon-move"></i> <em>Drag the button into your bookmarks bar then click it to launch the&nbsp;Hypothesis&nbsp;application.</em></p>
				      		<p class="installer__info">Or right click and select "bookmark this link."</p>
				      		<p class="installer__info">Are you a Chrome user? We have an <a href="#install">extension for you</a>.</p>
				    		</div><!-- /.installer__sectionbookmarklet -->
				    	</div><!-- /.modal-body -->
				    </div><!-- /.modal-content -->
				  </div><!-- /.modal-dialog -->
				</div><!-- /.modal-fade -->
		  </div><!-- /.col -->
		</div><!-- /.row -->
	</div><!-- /.container -->


<section id="features">
  <div class="container">
		<div class="row hypo-space">
		  <div class="col-sm-6 col-md-6">
			  <img src="http://127.0.1.1/Hypothesis/wp-content/uploads/2015/02/screenshot3.jpg" 
			  	   class="img-rounded"
			  	   width="300px"
			  	   alt="..." />
		  </div>
		  <div class="col-sm-6 col-md-6">
				<div class="caption">
				  <h3>Select</h3>
				  <p>Select text in PDFs and web pages.</p>
				</div>
		  </div>
		</div>

		<div class="row hypo-space">
		  <div class="col-sm-6 col-md-6">
			  <img src="http://127.0.1.1/Hypothesis/wp-content/uploads/2015/02/Selection_012.jpg" 
			  	   class="img-rounded"
			  	   width="300px"
			  	   alt="..." />
		  </div>
		  <div class="col-sm-6 col-md-6">
				<div class="caption">
				  <h3>Annotate</h3>
				  <p>Make highlights or leave notes.</p>
				</div>
		  </div>
		</div>

		<div class="row hypo-space">
		  <div class="col-sm-6 col-md-6">
			  <img src="http://127.0.1.1/Hypothesis/wp-content/uploads/2015/02/screenshot2.jpg"
			  		 width="300px" 
			  	   alt="..." />
		  </div>
		  <div class="col-sm-6 col-md-6">
				<div class="caption">
				  <h3>Reply</h3>
				  <p>Have threaded conversations and get notifications when people reply.</p>
				</div>
		  </div>
		</div>

<!-- 		<div class="row hypo-space">
		  <div class="col-sm-6 col-md-6">
			  <img src="http://127.0.1.1/Hypothesis/wp-content/uploads/2012/11/placehold.gif" 
			  	   alt="..." />
		  </div>
		  <div class="col-sm-6 col-md-6">
				<div class="caption">
				  <h3>Stream</h3>
				  Control the visibility of annotations, and share annotations with friends, fellow researchers, study buddies, etc...
				</div>
		  </div>
		</div> -->
  </div><!-- / .container -->
</section><!-- / #features -->
</div><!-- /.hypo-tron -->
