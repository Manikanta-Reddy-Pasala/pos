import { postApiRequest } from 'src/components/Helpers/ApiHelper';

const handleResponse = (response) => {
  let responseData = { status: 0, message: '', api_call: '' };

  if (response.data) {
    responseData.status = response.data.status;
    responseData.message = response.data.message;
    responseData.api_call = response.data.api_call;
  } else {
    responseData.message = response.errorMessage;
  }

  return responseData;
};

export const get3BData = async (reqData) => {
  const response = await postApiRequest(
    '/v1/gst/gst-zen/gstr3b/autoLiabilities',
    reqData
  );
  return handleResponse(response);
};

export const retTrack = async (reqData) => {
  const response = await postApiRequest(
    '/v1/gst/gst-zen/returns/status',
    reqData
  );
  let responseData = handleResponse(response);
  responseData.code = response.status;
  return responseData;
};

export const save3BDataAPI = async (reqData) => {
  const response = await postApiRequest(
    '/v1/gst/gst-zen/gstr3b/save',
    reqData
  );
  return handleResponse(response);
};
export const save3BDataCopyAPI = async (reqData) => {
  const response = await postApiRequest(
    '/v1/gst/gst-zen/gstr3b/SaveGstr3bCopy',
    reqData
  );
  return handleResponse(response);
};

export const get3BRetSumData = async (reqData) => {
  const response = await postApiRequest(
    '/v1/gst/gst-zen/gstr3b/download',
    reqData
  );
  return handleResponse(response);
};

export const get2BData = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '' };

  const response = await postApiRequest('/v1/gst/gst-zen/gstr2/gst2B', reqData);
  if (response.data) {
    responseData.status = response.data.status;
    responseData.message = response.data.message;
    responseData.api_call = response.data.api_call;
  } else {
    responseData.message = response.errorMessage;
  }

  return responseData;
};
export const get2BDummyData = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '' };

  const response = {
    "status": 1,
    "api_call": "GSTR2B GET ALL",
    "message": {
      "chksum": "ADFADRGA4GADFADGERER",
      "data": {
        "gstin": "01AABCE2207R1Z5",
        "rtnprd": "032020",
        "version": "1.0",
        "gendt": "14-04-2020",
        "itcsumm": {
          "itcavl": {
            "nonrevsup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "b2b": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "b2ba": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "isdsup": {
              "igst": 800,
              "cgst": 400,
              "sgst": 400,
              "cess": 200,
              "isd": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isda": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "revsup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "b2b": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "b2ba": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "imports": {
              "igst": 800,
              "cgst": 400,
              "sgst": 400,
              "cess": 200,
              "impg": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impgsez": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impga": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impgasez": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "othersup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrrev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrarev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isd": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isda": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            }
          },
          "itcunavl": {
            "nonrevsup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "b2b": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "b2ba": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "isdsup": {
              "igst": 800,
              "cgst": 400,
              "sgst": 400,
              "cess": 200,
              "isd": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isda": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "revsup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "b2b": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "b2ba": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "imports": {
              "igst": 800,
              "cgst": 400,
              "sgst": 400,
              "cess": 200,
              "impg": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impgsez": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impga": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "impgasez": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "othersup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrrev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrarev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isd": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isda": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            }
          },
          "itcrev": {
            "nonrevsup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "b2b": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "b2ba": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            },
            "isdsup": {
              "igst": 0,
              "cgst": 0,
              "sgst": 0,
              "cess": 0,
              "isd": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              },
              "isda": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              }
            },
            "imports": {
              "igst": 0,
              "cgst": 0,
              "sgst": 0,
              "cess": 0,
              "impg": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              },
              "impgsez": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              },
              "impga": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              },
              "impgasez": {
                "igst": 0,
                "cgst": 0,
                "sgst": 0,
                "cess": 0
              }
            },
            "othersup": {
              "igst": 1600,
              "cgst": 800,
              "sgst": 800,
              "cess": 400,
              "cdnr": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnra": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrrev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "cdnrarev": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isd": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              },
              "isda": {
                "igst": 400,
                "cgst": 200,
                "sgst": 200,
                "cess": 100
              }
            }
          }
        },
        "cpsumm": {
          "b2b": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "ttldocs": 3,
              "txval": 500,
              "igst": 400,
              "cgst": 0,
              "sgst": 0,
              "cess": 100
            }
          ],
          "b2ba": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "ttldocs": 3,
              "txval": 500,
              "igst": 400,
              "cgst": 0,
              "sgst": 0,
              "cess": 100
            }
          ],
          "cdnr": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "nttyp": "C",
              "ttldocs": 3,
              "txval": 400,
              "igst": 0,
              "cgst": 200,
              "sgst": 200,
              "cess": 0
            }
          ],
          "cdnra": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "nttyp": "C",
              "ttldocs": 3,
              "txval": 400,
              "igst": 0,
              "cgst": 200,
              "sgst": 200,
              "cess": 0
            }
          ],
          "isd": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "doctyp": "ISDI",
              "ttldocs": 3,
              "igst": 0,
              "cgst": 200,
              "sgst": 200,
              "cess": 0
            }
          ],
          "isda": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "doctyp": "ISDC",
              "ttldocs": 3,
              "igst": 0,
              "cgst": 200,
              "sgst": 200,
              "cess": 0
            }
          ],
          "impgsez": [
            {
              "ctin": "00AABCE2207R1Z5",
              "trdnm": "GSTN",
              "portcode": "18272A",
              "ttldocs": 3,
              "txval": 500,
              "igst": 400,
              "cess": 100
            }
          ],
          "itcrev": [
            {
              "b2b": {
                "ctin": "00AABCE2207R1Z5",
                "trdnm": "GSTN",
                "supprd": "022020",
                "supfildt": "02-03-2020",
                "ttldocs": 3,
                "txval": 500,
                "igst": 400,
                "cgst": 0,
                "sgst": 0,
                "cess": 100
              },
              "b2ba": {
                "ctin": "00AABCE2207R1Z5",
                "trdnm": "GSTN",
                "supprd": "022020",
                "supfildt": "02-03-2020",
                "ttldocs": 3,
                "txval": 500,
                "igst": 400,
                "cgst": 0,
                "sgst": 0,
                "cess": 100
              },
              "cdnr": {
                "ctin": "00AABCE2207R1Z5",
                "trdnm": "GSTN",
                "supprd": "022020",
                "supfildt": "02-03-2020",
                "nttyp": "D",
                "ttldocs": 3,
                "txval": 400,
                "igst": 0,
                "cgst": 200,
                "sgst": 200,
                "cess": 0
              },
              "cdnra": {
                "ctin": "00AABCE2207R1Z5",
                "trdnm": "GSTN",
                "supprd": "022020",
                "supfildt": "02-03-2020",
                "nttyp": "D",
                "ttldocs": 3,
                "txval": 400,
                "igst": 0,
                "cgst": 200,
                "sgst": 200,
                "cess": 0
              }
            }
          ]
        },
        "docdata": {
          "b2b": [
            {
              "ctin": "01AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supfildt": "18-11-2019",
              "supprd": "112019",
              "inv": [
                {
                  "inum": "S008400",
                  "typ": "R",
                  "dt": "24-11-2016",
                  "val": 729248.16,
                  "pos": "06",
                  "rev": "N",
                  "itcavl": "N",
                  "rsn": "P",
                  "diffprcnt": 1,
                  "srctyp": "e-Invoice",
                  "irn": "897ADG56RTY78956HYUG90BNHHIJK453GFTD99845672FDHHHSHGFH4567FG56TR",
                  "irngendate": "24-12-2019",
                  "items": [
                    {
                      "num": 1,
                      "rt": 5,
                      "txval": 400,
                      "igst": 0,
                      "cgst": 200,
                      "sgst": 200,
                      "cess": 0
                    }
                  ]
                }
              ]
            }
          ],
          "b2ba": [
            {
              "ctin": "01AABCE2207R1Z5",
              "trdnm": "GSTN",
              "supfildt": "18-11-2019",
              "supprd": "112019",
              "inv": [
                {
                  "oinum": "S008400",
                  "oidt": "24-11-2016",
                  "inum": "S008400",
                  "typ": "R",
                  "dt": "24-11-2016",
                  "val": 729248.16,
                  "pos": "06",
                  "rev": "N",
                  "itcavl": "N",
                  "rsn": "P",
                  "diffprcnt": 1,
                  "items": [
                    {
                      "num": 1,
                      "rt": 5,
                      "txval": 400,
                      "igst": 0,
                      "cgst": 200,
                      "sgst": 200,
                      "cess": 0
                    }
                  ]
                }
              ]
            }
          ],
          "cdnr": [
            {
              "ctin": "01AAAAP1208Q1ZS",
              "trdnm": "GSTN",
              "supfildt": "18-11-2019",
              "supprd": "112019",
              "nt": [
                {
                  "ntnum": "533515",
                  "typ": "C",
                  "suptyp": "R",
                  "dt": "23-09-2016",
                  "val": 729248.16,
                  "pos": "01",
                  "rev": "N",
                  "itcavl": "N",
                  "rsn": "C",
                  "diffprcnt": 1,
                  "srctyp": "e-Invoice",
                  "irn": "897ADG56RTY78956HYUG90BNHHIJK453GFTD99845672FDHHHSHGFH4567FG56TR",
                  "irngendate": "24-12-2019",
                  "items": [
                    {
                      "num": 1,
                      "rt": 5,
                      "txval": 400,
                      "igst": 400,
                      "cgst": 0,
                      "sgst": 0,
                      "cess": 0
                    }
                  ]
                }
              ]
            }
          ],
          "cdnra": [
            {
              "ctin": "01AAAAP1208Q1ZS",
              "trdnm": "GSTN",
              "supfildt": "18-11-2019",
              "supprd": "112019",
              "nt": [
                {
                  "onttyp": "C",
                  "ontnum": "533515",
                  "ontdt": "23-09-2016",
                  "ntnum": "533515",
                  "typ": "C",
                  "suptyp": "R",
                  "dt": "23-09-2016",
                  "val": 729248.16,
                  "pos": "01",
                  "rev": "N",
                  "itcavl": "N",
                  "rsn": "C",
                  "diffprcnt": 1,
                  "items": [
                    {
                      "num": 1,
                      "rt": 5,
                      "txval": 400,
                      "igst": 0,
                      "cgst": 200,
                      "sgst": 200,
                      "cess": 0
                    }
                  ]
                }
              ]
            }
          ],
          "isd": [
            {
              "ctin": "16DEFPS8555D1Z7",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "doclist": [
                {
                  "doctyp": "ISDI",
                  "docnum": "S0080",
                  "docdt": "03-03-2016",
                  "oinvnum": "P0079",
                  "oinvdt": "03-03-2016",
                  "igst": 0,
                  "cgst": 200,
                  "sgst": 200,
                  "cess": 0,
                  "itcelg": "Y"
                }
              ]
            }
          ],
          "isda": [
            {
              "ctin": "16DEFPS8555D1Z7",
              "trdnm": "GSTN",
              "supprd": "022020",
              "supfildt": "02-03-2020",
              "doclist": [
                {
                  "odoctyp": "ISDC",
                  "odocnum": "1004",
                  "odocdt": "02-03-2016",
                  "doctyp": "ISDI",
                  "docnum": "S0080",
                  "docdt": "03-03-2016",
                  "oinvnum": "P0079",
                  "oinvdt": "03-03-2016",
                  "igst": 0,
                  "cgst": 200,
                  "sgst": 200,
                  "cess": 0,
                  "itcelg": "Y"
                }
              ]
            }
          ],
          "impg": [
            {
              "refdt": "28-11-2019",
              "recdt": "30-11-2019",
              "portcode": "18272A",
              "boenum": "2566282",
              "boedt": "18-11-2019",
              "isamd": "N",
              "txval": 123.02,
              "igst": 123.02,
              "cess": 0.5
            }
          ],
          "impgsez": [
            {
              "ctin": "01AABCE2207R1Z5",
              "trdnm": "GSTN",
              "boe": [
                {
                  "refdt": "28-11-2019",
                  "recdt": "30-11-2019",
                  "portcode": "18272A",
                  "boenum": "2566282",
                  "boedt": "18-11-2019",
                  "isamd": "N",
                  "txval": 123.02,
                  "igst": 123.02,
                  "cess": 0.5
                }
              ]
            }
          ],
          "itcrev": [
            {
              "b2b": [
                {
                  "ctin": "01AABCE2207R1Z5",
                  "trdnm": "GSTN",
                  "supfildt": "18-11-2019",
                  "supprd": "112019",
                  "inv": [
                    {
                      "inum": "S008400",
                      "typ": "R",
                      "dt": "24-11-2016",
                      "val": 729248.16,
                      "pos": "06",
                      "rev": "N",
                      "itcavl": "N",
                      "rsn": "P",
                      "diffprcnt": 1,
                      "srctyp": "e-Invoice",
                      "irn": "897ADG56RTY78956HYUG90BNHHIJK453GFTD99845672FDHHHSHGFH4567FG56TR",
                      "irngendate": "24-12-2019",
                      "items": [
                        {
                          "num": 1,
                          "rt": 5,
                          "txval": 400,
                          "igst": 0,
                          "cgst": 200,
                          "sgst": 200,
                          "cess": 0
                        }
                      ]
                    }
                  ]
                }
              ],
              "b2ba": [
                {
                  "ctin": "01AABCE2207R1Z5",
                  "trdnm": "GSTN",
                  "supfildt": "18-11-2019",
                  "supprd": "112019",
                  "inv": [
                    {
                      "oinum": "S008400",
                      "oidt": "24-11-2016",
                      "inum": "S008400",
                      "typ": "R",
                      "dt": "24-11-2016",
                      "val": 729248.16,
                      "pos": "06",
                      "rev": "N",
                      "itcavl": "N",
                      "rsn": "P",
                      "diffprcnt": 1,
                      "items": [
                        {
                          "num": 1,
                          "rt": 5,
                          "txval": 400,
                          "igst": 0,
                          "cgst": 200,
                          "sgst": 200,
                          "cess": 0
                        }
                      ]
                    }
                  ]
                }
              ],
              "cdnr": [
                {
                  "ctin": "01AAAAP1208Q1ZS",
                  "trdnm": "GSTN",
                  "supfildt": "18-11-2019",
                  "supprd": "112019",
                  "nt": [
                    {
                      "ntnum": "533515",
                      "typ": "D",
                      "suptyp": "R",
                      "dt": "23-09-2016",
                      "val": 729248.16,
                      "pos": "01",
                      "rev": "N",
                      "itcavl": "N",
                      "rsn": "C",
                      "diffprcnt": 1,
                      "srctyp": "e-Invoice",
                      "irn": "897ADG56RTY78956HYUG90BNHHIJK453GFTD99845672FDHHHSHGFH4567FG56TR",
                      "irngendate": "24-12-2019",
                      "items": [
                        {
                          "num": 1,
                          "rt": 5,
                          "txval": 400,
                          "igst": 400,
                          "cgst": 0,
                          "sgst": 0,
                          "cess": 0
                        }
                      ]
                    }
                  ]
                }
              ],
              "cdnra": [
                {
                  "ctin": "01AAAAP1208Q1ZS",
                  "trdnm": "GSTN",
                  "supfildt": "18-11-2019",
                  "supprd": "112019",
                  "nt": [
                    {
                      "onttyp": "D",
                      "ontnum": "533515",
                      "ontdt": "23-09-2016",
                      "ntnum": "533515",
                      "typ": "D",
                      "suptyp": "R",
                      "dt": "23-09-2016",
                      "val": 729248.16,
                      "pos": "01",
                      "rev": "N",
                      "itcavl": "N",
                      "rsn": "C",
                      "diffprcnt": 1,
                      "items": [
                        {
                          "num": 1,
                          "rt": 5,
                          "txval": 400,
                          "igst": 0,
                          "cgst": 200,
                          "sgst": 200,
                          "cess": 0
                        }
                      ]
                    }
                  ]
                }
              ]
            }
          ]
        }
      }
    }
  };
  if (response) {
    responseData.status = response.status;
    responseData.message = response.message;
    responseData.api_call = response.api_call;
  }

  return responseData;
};

export const get2AData = async (reqData, type) => {
  let responseData = { status: 0, message: '', api_call: '' };

  const response = await postApiRequest(
    '/v1/gst/gst-zen/gstr2/' + type,
    reqData
  );
  if (response.data) {
    responseData.status = response.data.status;
    responseData.message = response.data.message;
    responseData.api_call = response.data.api_call;
  }

  return responseData;
};
export const get2ADummyData = async (reqData, type) => {
  let responseData = { status: 0, message: '', api_call: '' };
  let response = '';
  if (type == 'b2b') {
    response = {
      "status": 1,
      "message": {
        "b2b": [
          {
            "ctin": "27AAGCG4576J1Z6",
            "inv": [
              {
                "chksum": "6efdd23c2cfe0cc5e9c316fa40e7f2dfdcd27ad46bb543af6e16e18b5471fb0a",
                "inum": "5020294507",
                "idt": "30-06-2024",
                "val": 279.48,
                "pos": "29",
                "rchrg": "N",
                "inv_typ": "R",
                "srctyp": "E-Invoice",
                "irn": "8f214811d90d9a5922c618dd6f7f1337758947cbdb3e5b0af1a66ce91e8f37d3",
                "irngendate": "01-07-2024",
                "itms": [
                  {
                    "num": 1,
                    "itm_det": {
                      "txval": 236.85,
                      "rt": 18,
                      "iamt": 42.63,
                      "camt": 0,
                      "samt": 0,
                      "csamt": 0
                    }
                  }
                ]
              },
              {
                "chksum": "6efdd23c2cfe0cc5e9c316fa40e7f2dfdcd27ad46bb543af6e16e18b5471fb0a",
                "inum": "5020294507",
                "idt": "30-06-2024",
                "val": 279.48,
                "pos": "29",
                "rchrg": "N",
                "inv_typ": "R",
                "srctyp": "E-Invoice",
                "irn": "8f214811d90d9a5922c618dd6f7f1337758947cbdb3e5b0af1a66ce91e8f37d3",
                "irngendate": "01-07-2024",
                "itms": [
                  {
                    "num": 1,
                    "itm_det": {
                      "txval": 236.85,
                      "rt": 18,
                      "iamt": 42.63,
                      "camt": 0,
                      "samt": 0,
                      "csamt": 0
                    }
                  }
                ]
              }
            ],
            "cfs": "Y",
            "cfs3b": "Y",
            "fldtr1": "11-Jul-24",
            "flprdr1": "Jun-24"
          }
        ]
      },
      "api_call": "GSTR2A GET B2B"
    };
  } else if (type == 'b2ba') {
    response = {
      "status": 1,
      "message": {
        "b2ba": [
          {
            "ctin": "01AABCE2207R1Z5",
            "cfs": "Y",
            "dtcancel": "27-Aug-19",
            "cfs3b": "Y",
            "fldtr1": "12-May-20",
            "flprdr1": "Apr-18",
            "inv": [
              {
                "chksum": "AflJufPlFStqKBZ",
                "inum": "S008400",
                "idt": "24-11-2016",
                "oinum": "S008400",
                "oidt": "24-11-2016",
                "val": 729248.16,
                "pos": "06",
                "rchrg": "N",
                "inv_typ": "R",
                "diff_percent": 0.65,
                "aspd": "Dec-18",
                "atyp": "R",
                "itms": [
                  {
                    "num": 1,
                    "itm_det": {
                      "rt": 1,
                      "txval": 6210.99,
                      "iamt": 0,
                      "camt": 614.44,
                      "samt": 5.68,
                      "csamt": 621.09
                    }
                  },
                  {
                    "num": 2,
                    "itm_det": {
                      "rt": 2,
                      "txval": 1000.05,
                      "iamt": 0,
                      "camt": 887.44,
                      "samt": 5.68,
                      "csamt": 50.12
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "api_call": "GSTR2A GET B2BA"
    };
  } else if (type == 'cdn') {
    response = {
      "status": 1,
      "message": {
        "cdn": [
          {
            "ctin": "01AAAAP1208Q1ZS",
            "cfs": "Y",
            "dtcancel": "27-Aug-19",
            "cfs3b": "Y",
            "fldtr1": "12-May-20",
            "flprdr1": "Apr-18",
            "nt": [
              {
                "chksum": "AflJufPlFStqKBZ",
                "ntty": "C",
                "nt_num": "533515",
                "nt_dt": "23-09-2016",
                "p_gst": "N",
                "inum": "915914",
                "idt": "23-09-2016",
                "val": 729248.16,
                "diff_percent": 0.65,
                "cflag": "A",
                "updby": "R",
                "d_flag": "Y",
                "inv_typ": "R",
                "pos": "06",
                "rchrg": "N",
                "aspd": "Dec-18",
                "atyp": "R",
                "itms": [
                  {
                    "num": 1,
                    "itm_det": {
                      "rt": 10.1,
                      "txval": 6210.99,
                      "iamt": 0,
                      "camt": 614.44,
                      "samt": 5.68,
                      "csamt": 621.09
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "api_call": "GSTR2A GET CDN"
    };
  } else if (type == 'cdna') {
    response = {
      "status": 1,
      "message": {
        "cdna": [
          {
            "ctin": "01AAAAP1208Q1ZS",
            "cfs": "Y",
            "dtcancel": "27-Aug-19",
            "cfs3b": "Y",
            "fldtr1": "12-May-20",
            "flprdr1": "Apr-18",
            "nt": [
              {
                "chksum": "AflJufPlFStqKBZ",
                "ntty": "C",
                "nt_num": "533515",
                "nt_dt": "23-09-2016",
                "ont_num": "533515",
                "ont_dt": "23-09-2016",
                "p_gst": "N",
                "inum": "915914",
                "idt": "23-09-2016",
                "val": 729248.16,
                "diff_percent": 0.65,
                "d_flag": "Y",
                "pos": "06",
                "rchrg": "N",
                "inv_typ": "R",
                "aspd": "Dec-18",
                "atyp": "R",
                "itms": [
                  {
                    "num": 1,
                    "itm_det": {
                      "rt": 10.1,
                      "txval": 6210.99,
                      "iamt": 0,
                      "camt": 614.44,
                      "samt": 5.68,
                      "csamt": 621.09
                    }
                  }
                ]
              }
            ]
          }
        ]
      },
      "api_call": "GSTR2A GET CDNA"
    };
  } else if (type == 'isdCredit') {
    response = {
      "status": 1,
      "message": {
        "isd": [
          {
            "ctin": "16DEFPS8555D1Z7",
            "cfs": "Y",
            "doclist": [
              {
                "chksum": "AflJufPlFStqKBZ",
                "isd_docty": "ISD",
                "docnum": "1004",
                "docdt": "02-03-2016",
                "itc_elg": "Y",
                "aspd": "Dec-18",
                "atyp": "R",
                "iamt": 20,
                "camt": 20,
                "samt": 20,
                "cess": 20
              }
            ]
          }
        ]
      },
      "api_call": "GSTR2A GET ISD"
    };
  } else if (type == 'impg') {
    response = {
      "status": 1,
      "message": {
        "impg": [
          {
            "refdt": "22-12-2019",
            "portcd": "INBLR4",
            "benum": 8108363,
            "bedt": "24-11-2019",
            "txval": 729248.16,
            "iamt": 87656.23,
            "csamt": 0,
            "amd": "Y"
          }
        ]
      },
      "api_call": "GSTR2A GET IMPG"
    };
  } else if (type == 'impgsez') {
    response = {
      "status": 1,
      "message": {
        "impgsez": [
          {
            "refdt": "27-11-2019",
            "portcd": "INBLR4",
            "benum": 8108363,
            "bedt": "24-11-2019",
            "sgstin": "33AACCA0121EAZG",
            "tdname": "Seema Ceramics",
            "txval": 729248.16,
            "iamt": 87656.23,
            "csamt": 0,
            "amd": "Y"
          }
        ]
      },
      "api_call": "GSTR2A GET IMPGSEZ"
    };
  }

  if (response != '') {
    responseData.status = response.status;
    responseData.message = response.message;
    responseData.api_call = response.api_call;
  }

  return responseData;
};

export const generateOTP = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };
  try {
    const response = await postApiRequest('/v1/gst/gst-zen/otp', reqData);
    if (response && response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    } else {
      responseData.status = 0;
      // responseData.message = 'Something went wrong. We are on it. Please retry';
      responseData.message = response.errorMessage;
    }
    responseData.code = response.status;
  } catch (err) {
    responseData.code = 500;
    // responseData.message = "API access is not available or user expiry Duration is less than or equal to auth token expiry duration";
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
  }

  return responseData;
};

export const validateOTP = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest('/v1/gst/gst-zen/session', reqData);
    if (response && response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    } else {
      responseData.status = 0;
      responseData.message = 'Something went wrong. We are on it. Please retry';
    }
    responseData.code = response.status;
  } catch (err) {
    responseData.code = 500;
    // responseData.message = "Invalid OTP!";
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
  }

  return responseData;
};

export const validateSession = async (gstin) => {
  // const API_SERVER = window.REACT_APP_API_SERVER;
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest('/v1/gst/gst-zen/session/' + gstin);
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    } else {
      responseData.message = response.errorMessage;
    }
    responseData.code = response.status;

  } catch (err) {
    if (err.response && err.response) {
      responseData.message = err.response.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
    // responseData.message = "GST Session is Inactive. Please Login!";
  }



  // await axios
  //   .post(`${API_SERVER}${'/v1/gst/gst-zen/session/'+gstin}`, {})
  //   .then((response) => {
  //     console.log('successfully completed:', response);

  //     if (response.data) {
  //       responseData.status = response.data.status;
  //       responseData.message = response.data.message;
  //       responseData.api_call = response.data.api_call;
  //     }
  //   })
  //   .catch((err) => {
  //     console.error('There was an error!', err.message);
  //     responseData.message = err.message;
  //   });

  return responseData;
};

export const isGSTRFiled = async (gstin, fp) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };
  let reqData = {
    gstin: gstin,
    ret_period: fp
  };
  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/returns/status',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const saveGSTR1API = async (reqData) => {
  let responseData = { status: 0, message: '', code: 0 };
  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/save/gstr1',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const resetGSTR1API = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/reset/gstr1',
      reqData
    );
    if (response) {
      responseData.status = response.status;
      responseData.message = response.message;
      responseData.api_call = response.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const saveValidateAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gstr1/returns/validate',
      reqData
    );
    if (response) {
      responseData.status = response.status;
      responseData.message = response.data;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const fileValidateAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/returns/os/file/validate',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const downloadGSTR1API = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/download/gstr1',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const retStatusAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/generate/gstr1Summary',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message.status_cd;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const proceedToEvcOtpAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/file/evc/otp',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const proceedToFileEVCAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/file/gstr1/evc',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message
        ? response.data.message.ack_num
        : '';
      responseData.api_call = response.data.api_call;
      responseData.errorMessage = response.data.errorMessage;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};
export const proceedToFileAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };
  try {
    const response = await postApiRequest(
      '/v1/gst/gst-zen/file/gstr1/readyToFile',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const returnsValidateAPI = async (reqData) => {
  let responseData = { status: 0, message: '', api_call: '', code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/os/returns/validate',
      reqData
    );
    if (response.data) {
      responseData.status = response.data.status;
      responseData.message = response.data.message;
      responseData.api_call = response.data.api_call;
    }
    responseData.code = response.status;
  } catch (err) {
    if (err.response && err.response.data) {
      responseData.message = err.response.data.message;
    } else {
      responseData.message = err.message;
    }
    responseData.code = 500;
  }

  return responseData;
};

export const checkGstr1DataAvailableAPI = async (reqData) => {
  let responseData = { status: false, code: 0 };

  try {
    const response = await postApiRequest(
      '/v1/gst/returns/os/saveGstr1/status',
      reqData
    );
    if (response.status === 200) {
      if (response.data && response.data.success === true) {
        responseData.status = true;
      } else {
        responseData.status = false;
      }
    }
    responseData.code = response.status;
  } catch (err) {
    responseData.code = 500;
  }

  return responseData;
};

export const getPrefixStatsBasedonInvoice = async (arr) => {
  const prefixMap = new Map(); // Initialize a new Map

  for (const obj of arr) {
    // Iterate over each object in the array
    const prefix = obj.prefix?.trim() || null; // Trim the prefix and handle null or undefined
    const sequenceParts = obj.sequenceNumber.toString().split('/'); // Split the sequenceNumber into parts

    // Check if sequenceParts has more than one element and if the second last element matches the regex
    // If true, assign the second last element of sequenceParts to datePrefix
    // Otherwise, assign undefined to datePrefix
    const datePrefix =
      sequenceParts.length > 1 &&
        /^\d{2}-\d{2}$/.test(sequenceParts[sequenceParts.length - 2])
        ? sequenceParts[sequenceParts.length - 2]
        : undefined;

    const sequenceNumber = parseFloat(sequenceParts.pop()) || 0; // Parse the last part of sequenceNumber to a float

    const mapKey = prefix || datePrefix; // Use prefix as the key, if it exists, otherwise use datePrefix
    // Get the current object from the map, or create a new one if it doesn't exist
    const current = prefixMap.get(mapKey) || {
      lowest: sequenceNumber,
      highest: sequenceNumber,
      datePrefix: datePrefix,
      sequenceNumbers: [],
      cancelNumber: 0,
      prefix: prefix,
      missingNumbers: [] // Initialize missingNumbers array
    };

    current.sequenceNumbers.push(sequenceNumber); // Add the sequenceNumber to the sequenceNumbers array
    current.lowest = Math.min(current.lowest, sequenceNumber); // Update the lowest sequenceNumber
    current.highest = Math.max(current.highest, sequenceNumber); // Update the highest sequenceNumber
    if (obj.isCancelled || obj.einvoiceBillStatus === 'Cancelled') {
      current.cancelNumber += 1; // Increment the cancelNumber if the object is cancelled
    }

    prefixMap.set(mapKey, current); // Set the current object in the map
  }

  // Calculate missing sequence numbers for each prefix group
  for (const [key, value] of prefixMap.entries()) {
    const { lowest, highest, sequenceNumbers } = value;
    const sequenceSet = new Set(sequenceNumbers);
    for (let i = lowest; i <= highest; i++) {
      if (!sequenceSet.has(i)) {
        value.missingNumbers.push(i); // Add missing number to the missingNumbers array
      }
    }
  }

  return prefixMap; // Return the map
};
export const filedSummaryTotal = async (sortedData) => {
  let vouchersTotal = 0;
  let taxableTotal = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;
  let cessTotal = 0;

  sortedData.map((item) => {
    if (item.sec_nm == 'B2B_4A' || item.sec_nm == 'B2B_4B' || item.sec_nm == 'B2CL' || item.sec_nm == 'EXP' || item.sec_nm == 'B2B_SEZWOP' || item.sec_nm == 'B2B_SEZWP' || item.sec_nm == 'B2B_6C' || item.sec_nm == 'B2CS' || item.sec_nm == 'NIL' || item.sec_nm == 'B2BA_4A' || item.sec_nm == 'B2BA_4B' || item.sec_nm == 'EXPA' || item.sec_nm == 'B2BA_SEZWP' || item.sec_nm == 'B2BA_SEZWOP' || item.sec_nm == 'CDNRA' || item.sec_nm == 'CDNURA' || item.sec_nm == 'B2CSA' || item.sec_nm == 'AT' || item.sec_nm == 'TXPD' || item.sec_nm == 'ATA' || item.sec_nm == 'TXPDA' || item.sec_nm == 'DOC_ISSUE') {
      if (item.ttl_rec && item.ttl_rec != undefined) {
        vouchersTotal += item.ttl_rec;
      }
      if (item.ttl_tax && item.ttl_tax != undefined) {
        taxableTotal += item.ttl_tax;
      }
      if (item.ttl_cgst && item.ttl_cgst != undefined) {
        cgstTotal += item.ttl_cgst;
      }
      if (item.ttl_sgst && item.ttl_sgst != undefined) {
        sgstTotal += item.ttl_sgst;
      }
      if (item.ttl_igst && item.ttl_igst != undefined) {
        igstTotal += item.ttl_igst;
      }
      if (item.ttl_cess && item.ttl_cess != undefined) {
        cessTotal += item.ttl_cess;
      }
    }

    if (item.sec_nm == 'CDNR' || item.sec_nm == 'CDNUR') {
      if (item.ttl_rec && item.ttl_rec != undefined) {
        vouchersTotal -= item.ttl_rec;
      }
      if (item.ttl_tax && item.ttl_tax != undefined) {
        taxableTotal -= item.ttl_tax;
      }
      if (item.ttl_cgst && item.ttl_cgst != undefined) {
        cgstTotal -= item.ttl_cgst;
      }
      if (item.ttl_sgst && item.ttl_sgst != undefined) {
        sgstTotal -= item.ttl_sgst;
      }
      if (item.ttl_igst && item.ttl_igst != undefined) {
        igstTotal -= item.ttl_igst;
      }
      if (item.ttl_cess && item.ttl_cess != undefined) {
        cessTotal -= item.ttl_cess;
      }
    }
  });

  let totalData = {
    vouchersTotal: vouchersTotal,
    taxableTotal: taxableTotal,
    cgstTotal: cgstTotal,
    sgstTotal: sgstTotal,
    igstTotal: igstTotal,
    cessTotal: cessTotal
  }

  return totalData; // Return the map
};
export const resp2ATotal = async (data) => {
  let totalInvCount = 0;
  let totalVal = 0;
  let totalIamt = 0;
  let totalCamt = 0;
  let totalSamt = 0;
  let totalCsamt = 0;

  data.b2b.forEach(business => {
    business.inv.forEach(invoice => {
      totalInvCount++;
      totalVal += invoice.val;

      invoice.itms.forEach(item => {
        totalIamt += item.itm_det.iamt || 0;
        totalCamt += item.itm_det.camt || 0;
        totalSamt += item.itm_det.samt || 0;
        totalCsamt += item.itm_det.csamt || 0;
      });
    });
  });

  const result = {
    totalInvCount,
    totalVal,
    totalIamt,
    totalCamt,
    totalSamt,
    totalCsamt
  };

  return result;
};
export const resp2BTotal = async (data) => {
  let invoicesCount = 0;
  let taxableAmount = 0;
  let taxAmount = 0;

  // Helper function to calculate totals for b2b, b2ba, cdnr, and cdnra sections
  const calculateTotals = (list) => {
    for (let i = 0; i < list.length; i++) {
      const item = list[i];
      if (item.inv) {
        for (let j = 0; j < item.inv.length; j++) {
          const inv = item.inv[j];
          invoicesCount += 1;
          for (let k = 0; k < inv.items.length; k++) {
            const invoiceItem = inv.items[k];
            taxableAmount += invoiceItem.txval || 0;
            taxAmount +=
              (invoiceItem.igst || 0) +
              (invoiceItem.cgst || 0) +
              (invoiceItem.sgst || 0) +
              (invoiceItem.cess || 0);
          }
        }
      }
    }
  };

  // Calculate totals for b2b, b2ba, cdnr, and cdnra sections
  calculateTotals(data.b2b || []);
  calculateTotals(data.b2ba || []);
  calculateTotals(data.cdnr || []);
  calculateTotals(data.cdnra || []);

  // Calculate totals for ISD section
  if (data.isd) {
    for (let i = 0; i < data.isd.length; i++) {
      const isdItem = data.isd[i];
      if (isdItem.doclist) {
        for (let j = 0; j < isdItem.doclist.length; j++) {
          const doc = isdItem.doclist[j];
          invoicesCount += 1;
          taxableAmount += 0;  // No taxable amount for ISD
          taxAmount += (doc.igst || 0) + (doc.cgst || 0) + (doc.sgst || 0) + (doc.cess || 0);
        }
      }
    }
  }

  // Calculate totals for ISDA section
  if (data.isda) {
    for (let i = 0; i < data.isda.length; i++) {
      const isdaItem = data.isda[i];
      if (isdaItem.doclist) {
        for (let j = 0; j < isdaItem.doclist.length; j++) {
          const doc = isdaItem.doclist[j];
          invoicesCount += 1;
          taxableAmount += 0;  // No taxable amount for ISDA
          taxAmount += (doc.igst || 0) + (doc.cgst || 0) + (doc.sgst || 0) + (doc.cess || 0);
        }
      }
    }
  }

  // Calculate totals for import goods (IMPG) section
  if (data.impg) {
    for (let i = 0; i < data.impg.length; i++) {
      const importItem = data.impg[i];
      invoicesCount += 1;
      taxableAmount += importItem.txval || 0;
      taxAmount += importItem.igst || 0;
    }
  }

  // Calculate totals for import goods SEZ (IMPGSEZ) section
  if (data.impgsez) {
    for (let i = 0; i < data.impgsez.length; i++) {
      const importItem = data.impgsez[i];
      if (importItem.boe) {
        for (let j = 0; j < importItem.boe.length; j++) {
          const boeItem = importItem.boe[j];
          invoicesCount += 1;
          taxableAmount += boeItem.txval || 0;
          taxAmount += boeItem.igst || 0;
        }
      }
    }
  }

  // Return the calculated totals
  return {
    totalInvoices: invoicesCount,
    totalTaxableAmount: taxableAmount,
    totalTax: taxAmount
  };
};


