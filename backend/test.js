<section class="episodes-section">
                    <h2 class="section-title"><i class="fas fa-list"></i> Episodes</h2>
                    <div class="episodes-grid">
                        <div class="episode-card <%= Number(AniEP) === 0 ? 'active' : '' %>"  data-ep="0" data-anime="<%=Number(AniId)+1%>">
                            <% const IMAGE2 = video.ImagePath;
                            const IAGE2 = IMAGE2.split("https://");
                            %> 
                            <% if (IAGE2 && IAGE2[1]) { %>
                                 <img class="episode-thumb" src="<%=video.ImagePath %> " alt="">
                           <% } else {%> 
                       <img class="episode-thumb" src="/<%=video.ImagePath %> " alt="">
                            <% } %> 
                            <div class="episode-info">
                                <div class="episode-number">Episode 1</div>
                                <div class="episode-name"><%= video.name %></div>
                            </div>
                        </div>
                        <% if (video.ep.length >0){ %> 
                            <% video.ep.forEach((value,i) => { %>
                                    <div class="episode-card <%= Number(AniEP) === (i + 1) ? 'active' : '' %>" data-ep="<%=i+1%>" data-anime="<%=Number(AniId)+1%>">
                                    <% const IMAGE3 = video.ImagePath;
                                    const IAGE3 = IMAGE3.split("https://");
                                    %> 
                                    <% if (IAGE3 && IAGE3[1]) { %>
                                         <img class="episode-thumb" src="<%=video.ImagePath %> " alt="">
                                   <% } else {%> 
                               <img class="episode-thumb" src="/<%=video.ImagePath %> " alt="">
                                    <% } %> 
                                    <div class="episode-info">
                                        <div class="episode-number">Episode <%= i+2 %></div>
                                        <div class="episode-name">
                                            <% if(video.ep[i].name) {%> 
                                        <%= video.ep[i].name%>
                                        <% } else { %>
                                             Episode No.<%= i+2 %>
                                            <% } %>  
                                    </div>
                                    </div>
                                </div>
                           <% }); %> 
                         <% }; %>  
                    </div>
                </section>
















                  <section class="episodes-section">
                    <h2 class="section-title"><i class="fas fa-list"></i> Episodes</h2>
                    <div class="episodes-grid">
                        <div class="episode-card <%= Number(AniEP) === 0 ? 'active' : '' %>"  data-ep="0" data-anime="<%=Number(AniId)+1%>">
                            <% const IMAGE2 = video.ImagePath;
                            const IAGE2 = IMAGE2.split("https://");
                            %> 
                            <% if (IAGE2 && IAGE2[1]) { %>
                                 <img class="episode-thumb" src="<%=video.ImagePath %> " alt="">
                           <% } else {%> 
                       <img class="episode-thumb" src="/<%=video.ImagePath %> " alt="">
                            <% } %> 
                            <div class="episode-info">
                                <div class="episode-number">Episode 1</div>
                                <div class="episode-name"><%= video.name %></div>
                            </div>
                        </div>
                        <% if (video.ep.length >0){ %> 
                            <% video.ep.forEach((value,i) => { %>
                                    <div class="episode-card <%= Number(AniEP) === (i + 1) ? 'active' : '' %>" data-ep="<%=i+1%>" data-anime="<%=Number(AniId)+1%>">
                                    <% const IMAGE3 = video.ImagePath;
                                    const IAGE3 = IMAGE3.split("https://");
                                    %> 
                                    <% if (IAGE3 && IAGE3[1]) { %>
                                         <img class="episode-thumb" src="<%=video.ImagePath %> " alt="">
                                   <% } else {%> 
                               <img class="episode-thumb" src="/<%=video.ImagePath %> " alt="">
                                    <% } %> 
                                    <div class="episode-info">
                                        <div class="episode-number">Episode <%= i+2 %></div>
                                        <div class="episode-name">
                                            <% if(video.ep[i].name) {%> 
                                        <%= video.ep[i].name%>
                                        <% } else { %>
                                             Episode No.<%= i+2 %>
                                            <% } %>  
                                    </div>
                                    </div>
                                </div>
                           <% }); %> 
                         <% }; %>  
                    </div>
                </section>