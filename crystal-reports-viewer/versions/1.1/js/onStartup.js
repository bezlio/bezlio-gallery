define(function () {
 
  function OnStartup (bezl) {        
    bezl.vars.reportListingLoading = true;
  }
  
  return {
    onStartup: OnStartup
  }
});