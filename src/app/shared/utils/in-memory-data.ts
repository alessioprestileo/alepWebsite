export class InMemoryData {
  createDb() {
    let external = [
      {"Id":"1e7b08fb-d420-42eb-90c2-9c4653be8ab8","Ticker":"COMPANY 1","Field":"AVG_TOT_ASSETS","DataPoints":{"2004-12-31T00:00:00":43312.0,"2005-12-31T00:00:00":49836.0,"2006-12-31T00:00:00":56245.496,"2007-12-31T00:00:00":67049.033,"2008-12-31T00:00:00":85012.6655,"2009-12-31T00:00:00":96582.385,"2010-12-31T00:00:00":96936.1165,"2011-12-31T00:00:00":97027.3685,"2012-12-31T00:00:00":95541.3532,"2013-12-31T00:00:00":97468.581,"2014-03-31T00:00:00":97769.6,"2014-06-30T00:00:00":98453.461}},
      {"Id":"2ca00a2a-76e5-460c-8725-d99dfefc8286","Ticker":"COMPANY 1","Field":"SEC_DEBT","DataPoints":{"2004-12-31T00:00:00":15459.0,"2005-12-31T00:00:00":19653.0,"2006-12-31T00:00:00":21002.35,"2007-12-31T00:00:00":27141.672,"2008-12-31T00:00:00":33949.196,"2009-12-31T00:00:00":28401.788,"2010-12-31T00:00:00":26381.164,"2011-12-31T00:00:00":21395.155,"2012-12-31T00:00:00":19814.087,"2013-12-31T00:00:00":18173.773,"2014-03-31T00:00:00":16054.0,"2014-06-30T00:00:00":17091.211}},
      {"Id":"25e40c0e-8240-48ea-bb68-7398d3689e8f","Ticker":"COMPANY 1","Field":"DEPOSITS","DataPoints":{"2004-12-31T00:00:00":24906.0,"2005-12-31T00:00:00":27517.0,"2006-12-31T00:00:00":31306.097,"2007-12-31T00:00:00":37656.226,"2008-12-31T00:00:00":40997.353,"2009-12-31T00:00:00":44969.089,"2010-12-31T00:00:00":48801.371,"2011-12-31T00:00:00":53215.577,"2012-12-31T00:00:00":60138.458,"2013-12-31T00:00:00":62262.366,"2014-03-31T00:00:00":62066.0,"2014-06-30T00:00:00":64313.192}},
      {"Id":"da0860fb-ea40-471e-a31e-a6bdd03d716b","Ticker":"COMPANY 1","Field":"EXPENSES","DataPoints":{"2004-12-31T00:00:00":752.0,"2005-12-31T00:00:00":884.0,"2006-12-31T00:00:00":1300.215,"2007-12-31T00:00:00":2520.73,"2008-12-31T00:00:00":4283.846,"2009-12-31T00:00:00":2498.292,"2010-12-31T00:00:00":2232.051,"2011-12-31T00:00:00":2210.974,"2012-12-31T00:00:00":2285.125,"2013-12-31T00:00:00":2137.354,"2014-03-31T00:00:00":518.0,"2014-06-30T00:00:00":1029.18}},
      {"Id":"fc936e65-3a1b-44d8-a051-b27de96ea62f","Ticker":"COMPANY 1","Field":"FIXED_ASSETS","DataPoints":{"2004-12-31T00:00:00":118.0,"2005-12-31T00:00:00":105.0,"2006-12-31T00:00:00":108.961,"2007-12-31T00:00:00":113.314,"2008-12-31T00:00:00":117.209,"2009-12-31T00:00:00":112.554,"2010-12-31T00:00:00":94.052,"2011-12-31T00:00:00":123.314,"2012-12-31T00:00:00":116.437,"2013-12-31T00:00:00":113.049,"2014-03-31T00:00:00":108.0,"2014-06-30T00:00:00":89.65}},
      {"Id":"98dd510d-155f-4ef8-bd98-cb268307c27a","Ticker":"COMPANY 1","Field":"NET_INCOME","DataPoints":{"2004-12-31T00:00:00":965.0,"2005-12-31T00:00:00":975.0,"2006-12-31T00:00:00":1045.891,"2007-12-31T00:00:00":1133.272,"2008-12-31T00:00:00":1310.367,"2009-12-31T00:00:00":1376.529,"2010-12-31T00:00:00":1399.314,"2011-12-31T00:00:00":1435.274,"2012-12-31T00:00:00":1440.059,"2013-12-31T00:00:00":1499.227,"2014-03-31T00:00:00":368.0,"2014-06-30T00:00:00":754.581}},
      {"Id":"1e8513de-b757-4820-898c-019b51a87895","Ticker":"COMPANY 1","Field":"NET_LOANS","DataPoints":{"2004-12-31T00:00:00":41242.0,"2005-12-31T00:00:00":46653.0,"2006-12-31T00:00:00":53585.229,"2007-12-31T00:00:00":64945.858,"2008-12-31T00:00:00":68364.784,"2009-12-31T00:00:00":70719.482,"2010-12-31T00:00:00":66958.248,"2011-12-31T00:00:00":68420.547,"2012-12-31T00:00:00":67902.66,"2013-12-31T00:00:00":67407.127,"2014-03-31T00:00:00":65344.0,"2014-06-30T00:00:00":67566.416}},
      {"Id":"02409ece-3603-4f52-b72c-d8c2a06d3fac","Ticker":"COMPANY 1","Field":"NET_LOSSES_WRITEDOWNS","DataPoints":{"2004-12-31T00:00:00":4.0,"2005-12-31T00:00:00":0.0,"2006-12-31T00:00:00":0.025,"2007-12-31T00:00:00":0.0,"2008-12-31T00:00:00":0.0,"2009-12-31T00:00:00":0.0,"2010-12-31T00:00:00":0.0,"2011-12-31T00:00:00":0.0,"2012-12-31T00:00:00":0.0,"2013-12-31T00:00:00":0.0,"2014-03-31T00:00:00":0.0,"2014-06-30T00:00:00":12.76}},
      {"Id":"0d16537b-ae6f-45ef-96a6-29bbe98cc930","Ticker":"COMPANY 1","Field":"OTHER_ASSETS","DataPoints":{"2004-12-31T00:00:00":144.0,"2005-12-31T00:00:00":403.0,"2006-12-31T00:00:00":376.123,"2007-12-31T00:00:00":1666.667,"2008-12-31T00:00:00":2912.591,"2009-12-31T00:00:00":1775.697,"2010-12-31T00:00:00":1190.209,"2011-12-31T00:00:00":1957.428,"2012-12-31T00:00:00":1657.416,"2013-12-31T00:00:00":1765.226,"2014-03-31T00:00:00":1722.0,"2014-06-30T00:00:00":1405.857}},
      {"Id":"3161fa3f-7b04-4491-bb24-fd72b2983208","Ticker":"COMPANY 1","Field":"OTHER_LIABILITIES","DataPoints":{"2004-12-31T00:00:00":681.0,"2005-12-31T00:00:00":1206.0,"2006-12-31T00:00:00":1401.958,"2007-12-31T00:00:00":2252.204,"2008-12-31T00:00:00":2163.319,"2009-12-31T00:00:00":1509.663,"2010-12-31T00:00:00":1396.213,"2011-12-31T00:00:00":1764.017,"2012-12-31T00:00:00":1626.8,"2013-12-31T00:00:00":1831.83,"2014-03-31T00:00:00":1933.0,"2014-06-30T00:00:00":1662.714}},
      {"Id":"b2a2bffa-45ef-4458-a365-81ded85e0ceb","Ticker":"COMPANY 1","Field":"TAXES","DataPoints":{"2004-12-31T00:00:00":173.0,"2005-12-31T00:00:00":163.0,"2006-12-31T00:00:00":194.382,"2007-12-31T00:00:00":215.709,"2008-12-31T00:00:00":207.127,"2009-12-31T00:00:00":155.577,"2010-12-31T00:00:00":174.65,"2011-12-31T00:00:00":176.577,"2012-12-31T00:00:00":238.243,"2013-12-31T00:00:00":130.937,"2014-03-31T00:00:00":64.0,"2014-06-30T00:00:00":80.785}},
      {"Id":"a32c10b0-093a-4351-9345-36f51064ae27","Ticker":"COMPANY 1","Field":"TOTAL_ASSETS","DataPoints":{"2004-12-31T00:00:00":46274.0,"2005-12-31T00:00:00":53398.0,"2006-12-31T00:00:00":59093.007,"2007-12-31T00:00:00":75005.035,"2008-12-31T00:00:00":95020.296,"2009-12-31T00:00:00":96907.451,"2010-12-31T00:00:00":96964.782,"2011-12-31T00:00:00":93580.06,"2012-12-31T00:00:00":96948.706,"2013-12-31T00:00:00":98636.2,"2014-03-31T00:00:00":96903.0,"2014-06-30T00:00:00":99821.184}},
      {"Id":"f379daed-fd50-40cc-9785-a62e7cf470ab","Ticker":"COMPANY 1","Field":"TOTAL_LOANS","DataPoints":{"2004-12-31T00:00:00":41679.0,"2005-12-31T00:00:00":46923.0,"2006-12-31T00:00:00":53791.44,"2007-12-31T00:00:00":65089.801,"2008-12-31T00:00:00":68690.572,"2009-12-31T00:00:00":71242.31,"2010-12-31T00:00:00":67523.932,"2011-12-31T00:00:00":69049.67,"2012-12-31T00:00:00":68566.518,"2013-12-31T00:00:00":68261.664,"2014-03-31T00:00:00":66237.0,"2014-06-30T00:00:00":68568.62}},
      {"Id":"742f0f8f-f6e6-4403-846c-730702e3d235","Ticker":"COMPANY 1","Field":"OTHER_EXPENSES","DataPoints":{"2013-12-31T00:00:00":56.074}},
      {"Id":"1fec835d-d9eb-4d31-ae2e-5df2da1f6ea1","Ticker":"COMPANY 1","Field":"SALARY","DataPoints":{"2013-12-31T00:00:00":533.78}},
      {"Id":"60a33bf3-72bc-4cff-9d36-a27b0755f800","Ticker":"COMPANY 1","Field":"PENSIONS","DataPoints":{"2013-12-31T00:00:00":52.671}},
      {"Id":"718ed4b6-de6e-4b44-ae64-80a13c0c9e76","Ticker":"COMPANY 1","Field":"SOC_COSTS","DataPoints":{"2013-12-31T00:00:00":47.784}},
      {"Id":"f6c07f6b-8b8e-4abf-9f93-84875b732474","Ticker":"COMPANY 1","Field":"ADMIN_COSTS","DataPoints":{"2013-12-31T00:00:00":327.344,"2014-03-31T00:00:00":81.0,"2014-06-30T00:00:00":169.679}},
      {"Id":"278ff84d-5d83-4a77-bb3d-a37a78d10ee3","Ticker":"COMPANY 2","Field":"AVG_TOT_ASSETS","DataPoints":{"2004-12-31T00:00:00":1173.0,"2005-12-31T00:00:00":1319.0,"2006-12-31T00:00:00":1486.851,"2007-12-31T00:00:00":1790.6595,"2008-12-31T00:00:00":2025.5185,"2009-12-31T00:00:00":2086.2035,"2010-12-31T00:00:00":2250.752,"2011-12-31T00:00:00":2396.7915,"2012-12-31T00:00:00":2364.6386,"2013-12-31T00:00:00":2381.552,"2014-03-31T00:00:00":2351.248,"2014-06-30T00:00:00":2417.203}},
      {"Id":"e4eb7433-af50-4225-b69d-bf7ffed10ace","Ticker":"COMPANY 2","Field":"SEC_DEBT","DataPoints":{"2004-12-31T00:00:00":225.0,"2005-12-31T00:00:00":390.0,"2006-12-31T00:00:00":415.0,"2007-12-31T00:00:00":560.0,"2008-12-31T00:00:00":475.0,"2009-12-31T00:00:00":385.5,"2010-12-31T00:00:00":553.0,"2011-12-31T00:00:00":605.0,"2012-12-31T00:00:00":505.0,"2013-12-31T00:00:00":354.0,"2014-03-31T00:00:00":392.0,"2014-06-30T00:00:00":392.0}},
      {"Id":"c15ee64d-eef8-4586-9e3c-7d8fb1b9230e","Ticker":"COMPANY 2","Field":"DEPOSITS","DataPoints":{"2004-12-31T00:00:00":801.0,"2005-12-31T00:00:00":765.0,"2006-12-31T00:00:00":917.623,"2007-12-31T00:00:00":1018.938,"2008-12-31T00:00:00":1093.92,"2009-12-31T00:00:00":1116.753,"2010-12-31T00:00:00":1258.216,"2011-12-31T00:00:00":1302.316,"2012-12-31T00:00:00":1409.265,"2013-12-31T00:00:00":1580.519,"2014-03-31T00:00:00":1676.718,"2014-06-30T00:00:00":1813.284}},
      {"Id":"76347136-5058-40a7-9eef-ea28adf74fee","Ticker":"COMPANY 2","Field":"EXPENSES","DataPoints":{"2004-12-31T00:00:00":21.0,"2005-12-31T00:00:00":23.0,"2006-12-31T00:00:00":33.783,"2007-12-31T00:00:00":69.346,"2008-12-31T00:00:00":103.637,"2009-12-31T00:00:00":51.638,"2010-12-31T00:00:00":52.074,"2011-12-31T00:00:00":62.592,"2012-12-31T00:00:00":61.144,"2013-12-31T00:00:00":58.325,"2014-03-31T00:00:00":14.272,"2014-06-30T00:00:00":29.213}},
      {"Id":"107dc951-6202-4c3d-9c20-b28bdff24d8d","Ticker":"COMPANY 2","Field":"FIXED_ASSETS","DataPoints":{"2004-12-31T00:00:00":11.0,"2005-12-31T00:00:00":10.0,"2006-12-31T00:00:00":9.415,"2007-12-31T00:00:00":9.418,"2008-12-31T00:00:00":8.457,"2009-12-31T00:00:00":9.039,"2010-12-31T00:00:00":8.559,"2011-12-31T00:00:00":8.926,"2012-12-31T00:00:00":9.021,"2013-12-31T00:00:00":16.531,"2014-03-31T00:00:00":16.508,"2014-06-30T00:00:00":16.235}},
      {"Id":"a26c022d-9a5f-46eb-a642-75dbe6954511","Ticker":"COMPANY 2","Field":"NET_INCOME","DataPoints":{"2004-12-31T00:00:00":36.0,"2005-12-31T00:00:00":36.0,"2006-12-31T00:00:00":40.601,"2007-12-31T00:00:00":42.386,"2008-12-31T00:00:00":51.32,"2009-12-31T00:00:00":53.812,"2010-12-31T00:00:00":46.455,"2011-12-31T00:00:00":42.366,"2012-12-31T00:00:00":43.76,"2013-12-31T00:00:00":43.9,"2014-03-31T00:00:00":11.158,"2014-06-30T00:00:00":22.415}},
      {"Id":"4b37ec6a-05ce-4fe1-85cb-f3e12fb69c17","Ticker":"COMPANY 2","Field":"NET_LOANS","DataPoints":{"2004-12-31T00:00:00":1104.0,"2005-12-31T00:00:00":1228.0,"2006-12-31T00:00:00":1428.324,"2007-12-31T00:00:00":1743.608,"2008-12-31T00:00:00":1731.759,"2009-12-31T00:00:00":1749.305,"2010-12-31T00:00:00":1890.604,"2011-12-31T00:00:00":1877.747,"2012-12-31T00:00:00":1870.666,"2013-12-31T00:00:00":1850.751,"2014-03-31T00:00:00":1857.64,"2014-06-30T00:00:00":1879.924}},
      {"Id":"30432e33-34b6-4461-90b3-ace2fd61c525","Ticker":"COMPANY 2","Field":"NET_LOSSES_WRITEDOWNS","DataPoints":{"2004-12-31T00:00:00":1.0,"2005-12-31T00:00:00":-1.0,"2006-12-31T00:00:00":-2.467,"2007-12-31T00:00:00":-1.889,"2008-12-31T00:00:00":2.551,"2009-12-31T00:00:00":0.381,"2010-12-31T00:00:00":-0.137,"2011-12-31T00:00:00":0.0,"2012-12-31T00:00:00":-3.792,"2013-12-31T00:00:00":-0.689,"2014-03-31T00:00:00":0.0,"2014-06-30T00:00:00":0.001}},
      {"Id":"893d750e-acaa-4711-b4b6-e3fea81329a8","Ticker":"COMPANY 2","Field":"OTHER_ASSETS","DataPoints":{"2004-12-31T00:00:00":12.0,"2005-12-31T00:00:00":16.0,"2006-12-31T00:00:00":13.485,"2007-12-31T00:00:00":17.459,"2008-12-31T00:00:00":19.418,"2009-12-31T00:00:00":14.31,"2010-12-31T00:00:00":12.425,"2011-12-31T00:00:00":12.053,"2012-12-31T00:00:00":14.373,"2013-12-31T00:00:00":13.902,"2014-03-31T00:00:00":13.6,"2014-06-30T00:00:00":12.587}},
      {"Id":"93f9daea-0312-4735-97f9-7971370b3776","Ticker":"COMPANY 2","Field":"OTHER_LIABILITIES","DataPoints":{"2004-12-31T00:00:00":13.0,"2005-12-31T00:00:00":19.0,"2006-12-31T00:00:00":17.631,"2007-12-31T00:00:00":18.966,"2008-12-31T00:00:00":17.951,"2009-12-31T00:00:00":20.479,"2010-12-31T00:00:00":16.234,"2011-12-31T00:00:00":18.415,"2012-12-31T00:00:00":17.799,"2013-12-31T00:00:00":18.059,"2014-03-31T00:00:00":28.786,"2014-06-30T00:00:00":43.444}},
      {"Id":"4c4bb4ef-1c64-4ade-9d93-961cef1ef164","Ticker":"COMPANY 2","Field":"TAXES","DataPoints":{"2004-12-31T00:00:00":4.0,"2005-12-31T00:00:00":3.0,"2006-12-31T00:00:00":4.779,"2007-12-31T00:00:00":1.279,"2008-12-31T00:00:00":4.834,"2009-12-31T00:00:00":7.797,"2010-12-31T00:00:00":3.787,"2011-12-31T00:00:00":4.655,"2012-12-31T00:00:00":6.182,"2013-12-31T00:00:00":7.769,"2014-03-31T00:00:00":1.861,"2014-06-30T00:00:00":4.302}},
      {"Id":"b02d6031-b757-49dd-bb73-d67b7fc7db03","Ticker":"COMPANY 2","Field":"TOTAL_ASSETS","DataPoints":{"2004-12-31T00:00:00":1251.0,"2005-12-31T00:00:00":1388.0,"2006-12-31T00:00:00":1585.506,"2007-12-31T00:00:00":1995.814,"2008-12-31T00:00:00":2055.223,"2009-12-31T00:00:00":2117.184,"2010-12-31T00:00:00":2384.32,"2011-12-31T00:00:00":2409.263,"2012-12-31T00:00:00":2315.558,"2013-12-31T00:00:00":2311.236,"2014-03-31T00:00:00":2391.259,"2014-06-30T00:00:00":2549.114}},
      {"Id":"669f76f6-2e38-4a78-a278-3b55015bbd7b","Ticker":"COMPANY 2","Field":"TOTAL_LOANS","DataPoints":{"2004-12-31T00:00:00":1126.0,"2005-12-31T00:00:00":1249.0,"2006-12-31T00:00:00":1444.546,"2007-12-31T00:00:00":1768.662,"2008-12-31T00:00:00":1752.521,"2009-12-31T00:00:00":1777.53,"2010-12-31T00:00:00":1935.609,"2011-12-31T00:00:00":1905.906,"2012-12-31T00:00:00":1890.512,"2013-12-31T00:00:00":1873.365,"2014-03-31T00:00:00":1880.848,"2014-06-30T00:00:00":1903.771}},
      {"Id":"30000c71-8203-4def-ae7a-b58e5774eb9f","Ticker":"COMPANY 2","Field":"OTHER_EXPENSES","DataPoints":{"2013-12-31T00:00:00":1.17}},
      {"Id":"33505973-64f9-44ab-8ea6-ce55ef069c05","Ticker":"COMPANY 2","Field":"SALARY","DataPoints":{"2013-12-31T00:00:00":12.746}},
      {"Id":"4b2364b8-364e-4989-ad75-d07c1cdda129","Ticker":"COMPANY 2","Field":"PENSIONS","DataPoints":{"2013-12-31T00:00:00":1.019}},
      {"Id":"658efe80-3bd6-4163-9c61-1fa811da0e9c","Ticker":"COMPANY 2","Field":"SOC_COSTS","DataPoints":{"2013-12-31T00:00:00":1.584}},
      {"Id":"12c3df72-075c-495a-b623-516fd812cf70","Ticker":"COMPANY 2","Field":"ADMIN_COSTS","DataPoints":{"2013-12-31T00:00:00":7.234,"2014-03-31T00:00:00":1.369,"2014-06-30T00:00:00":3.696}},
      {"Id":"e563a915-b8ed-45bc-8319-2c04ec9c0299","Ticker":"COMPANY 3","Field":"AVG_TOT_ASSETS","DataPoints":{"2004-12-31T00:00:00":1457.1,"2005-12-31T00:00:00":1618.7,"2006-12-31T00:00:00":1877.7,"2007-12-31T00:00:00":2169.6,"2008-12-31T00:00:00":2405.5,"2009-12-31T00:00:00":2628.7,"2010-12-31T00:00:00":2817.5,"2011-12-31T00:00:00":3016.3,"2012-12-31T00:00:00":3296.3268,"2013-12-31T00:00:00":3456.903,"2014-03-31T00:00:00":3588.286,"2014-06-30T00:00:00":3650.692}},
      {"Id":"c5ffefd3-cf0b-49f9-8fd5-7644d0381b8a","Ticker":"COMPANY 3","Field":"SEC_DEBT","DataPoints":{"2004-12-31T00:00:00":50.0,"2005-12-31T00:00:00":100.0,"2006-12-31T00:00:00":250.0,"2007-12-31T00:00:00":377.5,"2008-12-31T00:00:00":477.0,"2009-12-31T00:00:00":647.0,"2010-12-31T00:00:00":597.0,"2011-12-31T00:00:00":666.2,"2012-12-31T00:00:00":711.577,"2013-12-31T00:00:00":741.524,"2014-03-31T00:00:00":759.388,"2014-06-30T00:00:00":719.16}},
      {"Id":"96c93ebb-c7c1-4265-b3a9-cff538ccf8d5","Ticker":"COMPANY 3","Field":"DEPOSITS","DataPoints":{"2007-12-31T00:00:00":1587.9,"2008-12-31T00:00:00":1727.9,"2009-12-31T00:00:00":1773.3,"2010-12-31T00:00:00":1932.8,"2011-12-31T00:00:00":2103.4,"2012-12-31T00:00:00":2232.207,"2013-12-31T00:00:00":2350.749,"2014-03-31T00:00:00":2407.564,"2014-06-30T00:00:00":2567.05}},
      {"Id":"9da197f8-da39-4cec-a324-988abf01c3f8","Ticker":"COMPANY 3","Field":"EXPENSES","DataPoints":{"2012-12-31T00:00:00":76.523,"2013-12-31T00:00:00":76.853,"2014-03-31T00:00:00":19.625,"2014-06-30T00:00:00":39.986}},
      {"Id":"dc875be6-4089-4851-9de6-e28de471ffed","Ticker":"COMPANY 3","Field":"FIXED_ASSETS","DataPoints":{"2007-12-31T00:00:00":1.7,"2008-12-31T00:00:00":4.2,"2009-12-31T00:00:00":11.2,"2010-12-31T00:00:00":11.4,"2011-12-31T00:00:00":37.7,"2012-12-31T00:00:00":37.77,"2013-12-31T00:00:00":37.865,"2014-03-31T00:00:00":37.243,"2014-06-30T00:00:00":36.623}},
      {"Id":"2442fd80-e674-4382-a04d-896262bace51","Ticker":"COMPANY 3","Field":"NET_INCOME","DataPoints":{"2007-12-31T00:00:00":58.5,"2008-12-31T00:00:00":57.9,"2009-12-31T00:00:00":58.9,"2010-12-31T00:00:00":57.3,"2011-12-31T00:00:00":63.9,"2012-12-31T00:00:00":70.262,"2013-12-31T00:00:00":73.945,"2014-03-31T00:00:00":19.642,"2014-06-30T00:00:00":39.24}},
      {"Id":"1475d7a8-0fe7-4333-9dad-648f4351e0f3","Ticker":"COMPANY 3","Field":"NET_LOANS","DataPoints":{"2007-12-31T00:00:00":1939.4,"2008-12-31T00:00:00":2055.2,"2009-12-31T00:00:00":2183.4,"2010-12-31T00:00:00":2367.3,"2011-12-31T00:00:00":2609.0,"2012-12-31T00:00:00":2804.073,"2013-12-31T00:00:00":3020.153,"2014-03-31T00:00:00":3073.848,"2014-06-30T00:00:00":3153.885}},
      {"Id":"20ec9bde-d0ed-4db9-90ff-f627729b2715","Ticker":"COMPANY 3","Field":"NET_LOSSES_WRITEDOWNS","DataPoints":{"2007-12-31T00:00:00":0.0,"2008-12-31T00:00:00":-2.2,"2009-12-31T00:00:00":-3.5,"2010-12-31T00:00:00":0.6,"2011-12-31T00:00:00":0.0,"2012-12-31T00:00:00":0.0,"2013-12-31T00:00:00":0.0,"2014-03-31T00:00:00":0.0,"2014-06-30T00:00:00":0.0}},
      {"Id":"623b3ff1-35ac-497b-b5e2-9cb2d3611860","Ticker":"COMPANY 3","Field":"OTHER_ASSETS","DataPoints":{"2007-12-31T00:00:00":13.6,"2008-12-31T00:00:00":16.2,"2009-12-31T00:00:00":17.1,"2010-12-31T00:00:00":13.6,"2011-12-31T00:00:00":11.6,"2012-12-31T00:00:00":30.077,"2013-12-31T00:00:00":26.62,"2014-03-31T00:00:00":26.154,"2014-06-30T00:00:00":35.77}},
      {"Id":"6304a166-2352-4e9f-a968-238bec17773b","Ticker":"COMPANY 3","Field":"OTHER_LIABILITIES","DataPoints":{"2007-12-31T00:00:00":36.8,"2008-12-31T00:00:00":35.2,"2009-12-31T00:00:00":36.3,"2010-12-31T00:00:00":27.7,"2011-12-31T00:00:00":33.8,"2012-12-31T00:00:00":40.244,"2013-12-31T00:00:00":35.187,"2014-03-31T00:00:00":49.621,"2014-06-30T00:00:00":63.64}},
      {"Id":"7e11f7d1-eea9-4d03-b7ef-8ad6381f342f","Ticker":"COMPANY 3","Field":"TAXES","DataPoints":{"2007-12-31T00:00:00":7.7,"2008-12-31T00:00:00":6.7,"2009-12-31T00:00:00":7.1,"2010-12-31T00:00:00":8.7,"2011-12-31T00:00:00":7.7,"2012-12-31T00:00:00":6.992,"2013-12-31T00:00:00":7.411,"2014-03-31T00:00:00":2.489,"2014-06-30T00:00:00":5.081}},
      {"Id":"2cfca907-651d-4f78-8818-55f2f5fe5dc1","Ticker":"COMPANY 3","Field":"TOTAL_ASSETS","DataPoints":{"2004-12-31T00:00:00":1504.5,"2005-12-31T00:00:00":1722.7,"2006-12-31T00:00:00":2021.7,"2007-12-31T00:00:00":2242.4,"2008-12-31T00:00:00":2485.7,"2009-12-31T00:00:00":2718.6,"2010-12-31T00:00:00":2898.4,"2011-12-31T00:00:00":3180.8,"2012-12-31T00:00:00":3377.078,"2013-12-31T00:00:00":3540.605,"2014-03-31T00:00:00":3635.967,"2014-06-30T00:00:00":3775.505}},
      {"Id":"0fafafda-480d-446f-8282-5c8378f8f60b","Ticker":"COMPANY 3","Field":"TOTAL_LOANS","DataPoints":{"2004-12-31T00:00:00":1369.9,"2005-12-31T00:00:00":1531.1,"2006-12-31T00:00:00":1749.5,"2007-12-31T00:00:00":1980.1,"2008-12-31T00:00:00":2095.028,"2009-12-31T00:00:00":2224.9,"2010-12-31T00:00:00":2411.7,"2011-12-31T00:00:00":2651.6,"2012-12-31T00:00:00":2849.305,"2013-12-31T00:00:00":3066.419,"2014-03-31T00:00:00":3120.965,"2014-06-30T00:00:00":3202.696}},
      {"Id":"6292db96-a833-4250-a7de-a6faad2cdef7","Ticker":"COMPANY 3","Field":"OTHER_EXPENSES","DataPoints":{"2013-12-31T00:00:00":1.973}},
      {"Id":"ee23c1fb-a738-4424-8476-5d4959089a2c","Ticker":"COMPANY 3","Field":"SALARY","DataPoints":{"2013-12-31T00:00:00":14.831}},
      {"Id":"75297c5a-b8e9-4e27-af3d-3863de3097f6","Ticker":"COMPANY 3","Field":"PENSIONS","DataPoints":{"2013-12-31T00:00:00":1.841}},
      {"Id":"7a91ead6-7d7b-452c-b5b9-a1380b8a3c12","Ticker":"COMPANY 3","Field":"SOC_COSTS","DataPoints":{"2013-12-31T00:00:00":3.682}},
      {"Id":"d08bb07a-fae9-4084-b3aa-93483c44cbe3","Ticker":"COMPANY 3","Field":"ADMIN_COSTS","DataPoints":{"2013-12-31T00:00:00":13.344,"2014-03-31T00:00:00":4.134,"2014-06-30T00:00:00":7.21}},
      {"Id":"3f13947a-ff81-400b-a268-37d27ba26f11","Ticker":"COMPANY 4","Field":"AVG_TOT_ASSETS","DataPoints":{"2004-12-31T00:00:00":6228.0,"2005-12-31T00:00:00":7268.0,"2006-12-31T00:00:00":8396.164,"2007-12-31T00:00:00":9819.301,"2008-12-31T00:00:00":11755.8865,"2009-12-31T00:00:00":13276.251,"2010-12-31T00:00:00":13715.464,"2011-12-31T00:00:00":17820.3145,"2012-12-31T00:00:00":17299.2438,"2013-12-31T00:00:00":17783.169,"2014-03-31T00:00:00":18054.467,"2014-06-30T00:00:00":18137.11}},
      {"Id":"0c59285e-4ceb-45aa-bceb-660eeb4ef51d","Ticker":"COMPANY 4","Field":"SEC_DEBT","DataPoints":{"2004-12-31T00:00:00":2159.0,"2005-12-31T00:00:00":2607.0,"2006-12-31T00:00:00":2977.339,"2007-12-31T00:00:00":4114.463,"2008-12-31T00:00:00":4979.285,"2009-12-31T00:00:00":5025.687,"2010-12-31T00:00:00":4464.457,"2011-12-31T00:00:00":4549.246,"2012-12-31T00:00:00":3780.1,"2013-12-31T00:00:00":4043.89,"2014-03-31T00:00:00":3974.543,"2014-06-30T00:00:00":3975.801}},
      {"Id":"1997db5e-27fd-480b-975e-f0da714e693a","Ticker":"COMPANY 4","Field":"DEPOSITS","DataPoints":{"2004-12-31T00:00:00":3609.0,"2005-12-31T00:00:00":4036.0,"2006-12-31T00:00:00":4547.696,"2007-12-31T00:00:00":5114.911,"2008-12-31T00:00:00":6170.931,"2009-12-31T00:00:00":6663.697,"2010-12-31T00:00:00":7250.289,"2011-12-31T00:00:00":10244.923,"2012-12-31T00:00:00":10691.122,"2013-12-31T00:00:00":10989.694,"2014-03-31T00:00:00":11138.899,"2014-06-30T00:00:00":11685.024}},
      {"Id":"629aa403-9e64-4fa5-97b7-914ded80112f","Ticker":"COMPANY 4","Field":"EXPENSES","DataPoints":{"2004-12-31T00:00:00":106.0,"2005-12-31T00:00:00":121.0,"2006-12-31T00:00:00":181.716,"2007-12-31T00:00:00":368.682,"2008-12-31T00:00:00":634.042,"2009-12-31T00:00:00":432.507,"2010-12-31T00:00:00":388.246,"2011-12-31T00:00:00":431.286,"2012-12-31T00:00:00":486.879,"2013-12-31T00:00:00":451.351,"2014-03-31T00:00:00":108.663,"2014-06-30T00:00:00":219.175}},
      {"Id":"69a97c3f-8b2c-46ff-bb46-b02d53b40fd2","Ticker":"COMPANY 4","Field":"FIXED_ASSETS","DataPoints":{"2004-12-31T00:00:00":17.0,"2005-12-31T00:00:00":16.0,"2006-12-31T00:00:00":14.508,"2007-12-31T00:00:00":29.035,"2008-12-31T00:00:00":63.699,"2009-12-31T00:00:00":67.656,"2010-12-31T00:00:00":61.688,"2011-12-31T00:00:00":108.377,"2012-12-31T00:00:00":100.694,"2013-12-31T00:00:00":103.456,"2014-03-31T00:00:00":100.777,"2014-06-30T00:00:00":98.477}},
      {"Id":"e07ab0b4-ecbd-4fd2-983f-eebd153ae59f","Ticker":"COMPANY 4","Field":"NET_INCOME","DataPoints":{"2004-12-31T00:00:00":156.0,"2005-12-31T00:00:00":163.0,"2006-12-31T00:00:00":171.969,"2007-12-31T00:00:00":191.353,"2008-12-31T00:00:00":216.739,"2009-12-31T00:00:00":211.283,"2010-12-31T00:00:00":220.318,"2011-12-31T00:00:00":206.125,"2012-12-31T00:00:00":260.039,"2013-12-31T00:00:00":290.789,"2014-03-31T00:00:00":71.595,"2014-06-30T00:00:00":142.705}},
      {"Id":"3ff4de8e-be59-4d27-b874-af4503debe45","Ticker":"COMPANY 4","Field":"NET_LOANS","DataPoints":{"2004-12-31T00:00:00":6088.0,"2005-12-31T00:00:00":7144.0,"2006-12-31T00:00:00":8501.23,"2007-12-31T00:00:00":9908.48,"2008-12-31T00:00:00":11414.11,"2009-12-31T00:00:00":11217.145,"2010-12-31T00:00:00":11305.599,"2011-12-31T00:00:00":14587.088,"2012-12-31T00:00:00":14105.54,"2013-12-31T00:00:00":14320.396,"2014-03-31T00:00:00":14492.298,"2014-06-30T00:00:00":14720.384}},
      {"Id":"ec8c8438-f44e-4561-ab72-ca38544b1a76","Ticker":"COMPANY 4","Field":"NET_LOANS_PCT","DataPoints":{"2004-12-31T00:00:00":16.15,"2005-12-31T00:00:00":17.35,"2006-12-31T00:00:00":18.99,"2007-12-31T00:00:00":16.5535,"2008-12-31T00:00:00":15.1954,"2009-12-31T00:00:00":-1.7256,"2010-12-31T00:00:00":0.7886,"2011-12-31T00:00:00":-2.5}},
      {"Id":"13c67700-c702-428d-8635-e6804d0adc94","Ticker":"COMPANY 4","Field":"NET_LOSSES_WRITEDOWNS","DataPoints":{"2004-12-31T00:00:00":0.0,"2005-12-31T00:00:00":-5.0,"2006-12-31T00:00:00":0.0,"2007-12-31T00:00:00":0.0,"2008-12-31T00:00:00":0.0,"2009-12-31T00:00:00":0.0,"2010-12-31T00:00:00":0.0,"2011-12-31T00:00:00":-57.576,"2012-12-31T00:00:00":0.0,"2013-12-31T00:00:00":0.0,"2014-03-31T00:00:00":0.0,"2014-06-30T00:00:00":0.0}},
      {"Id":"1bbc6118-01d7-47f5-b0ca-b07cb2111d7b","Ticker":"COMPANY 4","Field":"OTHER_ASSETS","DataPoints":{"2004-12-31T00:00:00":39.0,"2005-12-31T00:00:00":36.0,"2006-12-31T00:00:00":47.752,"2007-12-31T00:00:00":29.498,"2008-12-31T00:00:00":126.298,"2009-12-31T00:00:00":94.069,"2010-12-31T00:00:00":106.978,"2011-12-31T00:00:00":170.947,"2012-12-31T00:00:00":183.13,"2013-12-31T00:00:00":215.089,"2014-03-31T00:00:00":196.781,"2014-06-30T00:00:00":144.51}},
      {"Id":"463198cb-a042-4202-993c-ef94ba8c3961","Ticker":"COMPANY 4","Field":"OTHER_LIABILITIES","DataPoints":{"2004-12-31T00:00:00":90.0,"2005-12-31T00:00:00":120.0,"2006-12-31T00:00:00":124.3,"2007-12-31T00:00:00":154.317,"2008-12-31T00:00:00":127.508,"2009-12-31T00:00:00":90.356,"2010-12-31T00:00:00":187.796,"2011-12-31T00:00:00":189.597,"2012-12-31T00:00:00":197.267,"2013-12-31T00:00:00":185.571,"2014-03-31T00:00:00":200.382,"2014-06-30T00:00:00":182.246}},
      {"Id":"4f878f29-c187-4936-b3aa-e448ab0c9ac1","Ticker":"COMPANY 4","Field":"TAXES","DataPoints":{"2004-12-31T00:00:00":29.0,"2005-12-31T00:00:00":33.0,"2006-12-31T00:00:00":32.187,"2007-12-31T00:00:00":28.708,"2008-12-31T00:00:00":6.635,"2009-12-31T00:00:00":16.628,"2010-12-31T00:00:00":31.959,"2011-12-31T00:00:00":10.891,"2012-12-31T00:00:00":58.795,"2013-12-31T00:00:00":46.694,"2014-03-31T00:00:00":10.568,"2014-06-30T00:00:00":23.8}},
      {"Id":"fba87411-7643-4b83-af4a-363a55eae57e","Ticker":"COMPANY 4","Field":"TOTAL_ASSETS","DataPoints":{"2004-12-31T00:00:00":6710.0,"2005-12-31T00:00:00":7827.0,"2006-12-31T00:00:00":8965.669,"2007-12-31T00:00:00":10672.933,"2008-12-31T00:00:00":12838.84,"2009-12-31T00:00:00":13713.662,"2010-12-31T00:00:00":13717.266,"2011-12-31T00:00:00":17586.35,"2012-12-31T00:00:00":17068.665,"2013-12-31T00:00:00":18032.068,"2014-03-31T00:00:00":18076.866,"2014-06-30T00:00:00":18302.397}},
      {"Id":"95220e41-fcc0-4837-8218-9b6ba3a62d1f","Ticker":"COMPANY 4","Field":"TOTAL_LOANS","DataPoints":{"2004-12-31T00:00:00":6141.0,"2005-12-31T00:00:00":7175.0,"2006-12-31T00:00:00":8530.271,"2007-12-31T00:00:00":9944.65,"2008-12-31T00:00:00":11490.385,"2009-12-31T00:00:00":11333.985,"2010-12-31T00:00:00":11399.46,"2011-12-31T00:00:00":14723.203,"2012-12-31T00:00:00":14203.62,"2013-12-31T00:00:00":14409.618,"2014-03-31T00:00:00":14595.621,"2014-06-30T00:00:00":14796.102}},
      {"Id":"c2c16ac5-ea24-41a2-943f-17383bb6cf7c","Ticker":"COMPANY 4","Field":"OTHER_EXPENSES","DataPoints":{"2013-12-31T00:00:00":9.118}},
      {"Id":"08e01c21-88f3-47a5-a8eb-3211f249f1bf","Ticker":"COMPANY 4","Field":"SALARY","DataPoints":{"2013-12-31T00:00:00":108.17}},
      {"Id":"382d61d2-89f2-4f07-a85b-d99cb6df6790","Ticker":"COMPANY 4","Field":"PENSIONS","DataPoints":{"2013-12-31T00:00:00":12.003}},
      {"Id":"2a7b2705-1685-4be3-b20b-285bf399463e","Ticker":"COMPANY 4","Field":"SOC_COSTS","DataPoints":{"2013-12-31T00:00:00":27.725}},
      {"Id":"2bb75327-12cd-4e37-a931-3bceefff84e9","Ticker":"COMPANY 4","Field":"ADMIN_COSTS","DataPoints":{"2013-12-31T00:00:00":71.892,"2014-03-31T00:00:00":17.358,"2014-06-30T00:00:00":35.804}},
      {"Id":"c91f9308-bdbd-4cef-a1f3-3f60d6fd6b93","Ticker":"COMPANY 5","Field":"AVG_TOT_ASSETS","DataPoints":{"2004-12-31T00:00:00":1141.0,"2005-12-31T00:00:00":1272.0,"2006-12-31T00:00:00":1464.384,"2007-12-31T00:00:00":1674.431,"2008-12-31T00:00:00":1845.696,"2009-12-31T00:00:00":2006.8315,"2010-12-31T00:00:00":2079.6315,"2011-12-31T00:00:00":2117.623,"2012-12-31T00:00:00":2224.5832,"2013-12-31T00:00:00":2347.961,"2014-03-31T00:00:00":2525.5,"2014-06-30T00:00:00":2590.076}},
      {"Id":"a88c8689-4539-4a5e-be79-32d8f0dab882","Ticker":"COMPANY 5","Field":"SEC_DEBT","DataPoints":{"2004-12-31T00:00:00":250.0,"2005-12-31T00:00:00":248.0,"2006-12-31T00:00:00":297.878,"2007-12-31T00:00:00":487.641,"2008-12-31T00:00:00":519.983,"2009-12-31T00:00:00":554.06,"2010-12-31T00:00:00":539.462,"2011-12-31T00:00:00":514.65,"2012-12-31T00:00:00":524.562,"2013-12-31T00:00:00":529.767,"2014-03-31T00:00:00":579.295,"2014-06-30T00:00:00":689.925}},
      {"Id":"95516bfc-e0e1-43e3-abf1-ccc7ef785a48","Ticker":"COMPANY 5","Field":"DEPOSITS","DataPoints":{"2004-12-31T00:00:00":793.0,"2005-12-31T00:00:00":866.0,"2006-12-31T00:00:00":985.382,"2007-12-31T00:00:00":975.624,"2008-12-31T00:00:00":1053.789,"2009-12-31T00:00:00":1124.627,"2010-12-31T00:00:00":1154.895,"2011-12-31T00:00:00":1267.604,"2012-12-31T00:00:00":1356.365,"2013-12-31T00:00:00":1574.392,"2014-03-31T00:00:00":1600.0,"2014-06-30T00:00:00":1645.236}},
      {"Id":"634f08c9-e46e-4096-a611-9eee93bffb0b","Ticker":"COMPANY 5","Field":"EXPENSES","DataPoints":{"2004-12-31T00:00:00":18.0,"2005-12-31T00:00:00":21.0,"2006-12-31T00:00:00":31.904,"2007-12-31T00:00:00":59.664,"2008-12-31T00:00:00":100.384,"2009-12-31T00:00:00":64.098,"2010-12-31T00:00:00":57.501,"2011-12-31T00:00:00":59.868,"2012-12-31T00:00:00":62.471,"2013-12-31T00:00:00":60.042,"2014-03-31T00:00:00":16.235,"2014-06-30T00:00:00":32.994}},
      {"Id":"3d80faa3-4950-492e-b537-32181745678c","Ticker":"COMPANY 5","Field":"FIXED_ASSETS","DataPoints":{"2004-12-31T00:00:00":7.0,"2005-12-31T00:00:00":5.0,"2006-12-31T00:00:00":4.299,"2007-12-31T00:00:00":3.384,"2008-12-31T00:00:00":2.942,"2009-12-31T00:00:00":4.386,"2010-12-31T00:00:00":2.585,"2011-12-31T00:00:00":3.452,"2012-12-31T00:00:00":2.847,"2013-12-31T00:00:00":2.232,"2014-03-31T00:00:00":2.02,"2014-06-30T00:00:00":1.819}},
      {"Id":"a38f4126-e41e-4fef-bd58-a14ee9e16c76","Ticker":"COMPANY 5","Field":"NET_INCOME","DataPoints":{"2004-12-31T00:00:00":29.0,"2005-12-31T00:00:00":31.0,"2006-12-31T00:00:00":33.59,"2007-12-31T00:00:00":35.153,"2008-12-31T00:00:00":42.027,"2009-12-31T00:00:00":42.032,"2010-12-31T00:00:00":46.585,"2011-12-31T00:00:00":52.151,"2012-12-31T00:00:00":55.367,"2013-12-31T00:00:00":61.817,"2014-03-31T00:00:00":15.517,"2014-06-30T00:00:00":31.819}},
      {"Id":"fc2b0e5d-5bd2-4a91-96c0-84ff664e9d6d","Ticker":"COMPANY 5","Field":"NET_LOANS","DataPoints":{"2004-12-31T00:00:00":1020.0,"2005-12-31T00:00:00":1176.0,"2006-12-31T00:00:00":1329.187,"2007-12-31T00:00:00":1546.323,"2008-12-31T00:00:00":1624.323,"2009-12-31T00:00:00":1572.184,"2010-12-31T00:00:00":1676.645,"2011-12-31T00:00:00":1766.38,"2012-12-31T00:00:00":1818.867,"2013-12-31T00:00:00":2053.679,"2014-03-31T00:00:00":2177.069,"2014-06-30T00:00:00":2231.018}},
      {"Id":"968c9101-0c18-41b1-9f6f-ae2faec8a5ea","Ticker":"COMPANY 5","Field":"NET_LOSSES_WRITEDOWNS","DataPoints":{"2004-12-31T00:00:00":0.0,"2005-12-31T00:00:00":0.0,"2006-12-31T00:00:00":0.0,"2007-12-31T00:00:00":0.0,"2008-12-31T00:00:00":0.0,"2009-12-31T00:00:00":0.0,"2010-12-31T00:00:00":0.49,"2011-12-31T00:00:00":0.0,"2012-12-31T00:00:00":0.0,"2013-12-31T00:00:00":-0.27,"2014-03-31T00:00:00":0.0,"2014-06-30T00:00:00":0.033}},
      {"Id":"0ddc7eaa-654e-4e05-b3f1-82c721a94d6a","Ticker":"COMPANY 5","Field":"OTHER_ASSETS","DataPoints":{"2004-12-31T00:00:00":7.0,"2005-12-31T00:00:00":9.0,"2006-12-31T00:00:00":9.54,"2007-12-31T00:00:00":13.666,"2008-12-31T00:00:00":16.243,"2009-12-31T00:00:00":12.101,"2010-12-31T00:00:00":13.582,"2011-12-31T00:00:00":15.979,"2012-12-31T00:00:00":9.928,"2013-12-31T00:00:00":10.129,"2014-03-31T00:00:00":11.938,"2014-06-30T00:00:00":12.051}},
      {"Id":"0f6f784e-aff2-4b0e-ae68-f7f5cfb95428","Ticker":"COMPANY 5","Field":"OTHER_LIABILITIES","DataPoints":{"2004-12-31T00:00:00":14.0,"2005-12-31T00:00:00":15.0,"2006-12-31T00:00:00":16.23,"2007-12-31T00:00:00":18.087,"2008-12-31T00:00:00":20.249,"2009-12-31T00:00:00":19.611,"2010-12-31T00:00:00":16.183,"2011-12-31T00:00:00":21.668,"2012-12-31T00:00:00":21.714,"2013-12-31T00:00:00":24.494,"2014-03-31T00:00:00":30.342,"2014-06-30T00:00:00":40.374}},
      {"Id":"f35b2e44-c486-45f2-83fd-fcbda8c4d2e8","Ticker":"COMPANY 5","Field":"TAXES","DataPoints":{"2004-12-31T00:00:00":4.0,"2005-12-31T00:00:00":3.0,"2006-12-31T00:00:00":3.709,"2007-12-31T00:00:00":3.72,"2008-12-31T00:00:00":3.543,"2009-12-31T00:00:00":5.648,"2010-12-31T00:00:00":6.781,"2011-12-31T00:00:00":7.868,"2012-12-31T00:00:00":9.43,"2013-12-31T00:00:00":10.016,"2014-03-31T00:00:00":2.301,"2014-06-30T00:00:00":5.572}},
      {"Id":"7fc6c0a3-189e-4479-94d2-991482222923","Ticker":"COMPANY 5","Field":"TOTAL_ASSETS","DataPoints":{"2004-12-31T00:00:00":1189.0,"2005-12-31T00:00:00":1356.0,"2006-12-31T00:00:00":1573.033,"2007-12-31T00:00:00":1775.829,"2008-12-31T00:00:00":1915.563,"2009-12-31T00:00:00":2098.1,"2010-12-31T00:00:00":2061.163,"2011-12-31T00:00:00":2174.083,"2012-12-31T00:00:00":2221.606,"2013-12-31T00:00:00":2481.875,"2014-03-31T00:00:00":2569.125,"2014-06-30T00:00:00":2719.229}},
      {"Id":"fb0375e0-0dda-4be5-8815-f366bbc831d8","Ticker":"COMPANY 5","Field":"TOTAL_LOANS","DataPoints":{"2004-12-31T00:00:00":1032.0,"2005-12-31T00:00:00":1189.0,"2006-12-31T00:00:00":1342.987,"2007-12-31T00:00:00":1557.823,"2008-12-31T00:00:00":1636.823,"2009-12-31T00:00:00":1588.584,"2010-12-31T00:00:00":1696.645,"2011-12-31T00:00:00":1788.75,"2012-12-31T00:00:00":1834.567,"2013-12-31T00:00:00":2075.679,"2014-03-31T00:00:00":2201.069,"2014-06-30T00:00:00":2255.858}},
      {"Id":"3341dbf9-5cdc-4366-ac3b-f9dd3ea49d9b","Ticker":"COMPANY 5","Field":"OTHER_EXPENSES","DataPoints":{"2013-12-31T00:00:00":1.182}},
      {"Id":"16bcba1a-5665-4ce4-95a7-f7372229483d","Ticker":"COMPANY 5","Field":"SALARY","DataPoints":{"2013-12-31T00:00:00":13.8}},
      {"Id":"0bf4aade-f7e6-4391-8144-0477e75b17b0","Ticker":"COMPANY 5","Field":"PENSIONS","DataPoints":{"2013-12-31T00:00:00":2.789}},
      {"Id":"60c0e5e3-616a-48ac-b2a9-0bf25ba03e9f","Ticker":"COMPANY 5","Field":"SOC_COSTS","DataPoints":{"2013-12-31T00:00:00":2.733}},
      {"Id":"e44a73fa-e47a-4b48-8409-005737b134e5","Ticker":"COMPANY 5","Field":"ADMIN_COSTS","DataPoints":{"2013-12-31T00:00:00":11.755,"2014-03-31T00:00:00":2.62,"2014-06-30T00:00:00":5.623}}
    ];
    let userData_collections = [
      {
        id: 1,
        dataSet: {
          "Id":"abc",
          "Ticker": "ALESSIO",
          "Field": "Field1",
          "DataPoints": {
            "Monday": 1,
            "Tuesday": 2,
            "Wednesday": 3,
          }
        },
        name: 'Collection1'
      },
      {
        id: 2,
        dataSet: {
          "Id":"def",
          "Ticker": "ALESSIO",
          "Field": "Field2",
          "DataPoints": {
            "Thursday": 4,
            "Friday": 5,
            "Saturday": 6,
          }
        },
        name: 'Collection2'
      }
    ];
    return {external, userData_collections};
  }
}