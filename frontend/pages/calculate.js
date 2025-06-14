import { useState } from 'react';

import { Bars3Icon } from '@heroicons/react/24/outline';

import Sidebar from '@/components/Sidebar';
import List from '@/components/calculator/List';

import ProtectedRoute from '@/components/routes/ProtectedRoute';
import SeverityRating from '@/components/calculator/SeverityRating';

// Base Group
const baseGroup = {
  AV: 'Attack Vector',
  AC: 'Attack Complexity',
  PR: 'Privileges Required',
  UI: 'User Interaction',
  S: 'Scope',
  C: 'Confidentiality',
  I: 'Integrity',
  A: 'Availability',
};

// Base Metrics
const baseMetrics = {
  AV: {
    N: {
      name: 'Network',
      description:
        "<b>Worst:</b> A vulnerability exploitable with network access means the vulnerable authorization scope is bound to the network stack and the attacker's path to the vulnerable system is at the network layer. Such a vulnerability is often termed 'remotely exploitable'.",
    },
    A: {
      name: 'Adjacent',
      description:
        "<b>Worse:</b> A vulnerability exploitable with adjacent network access means the vulnerable authorization scope is bound to the network stack and the attacker's path to the vulnerable system is at the data link layer. Examples include local IP subnet, Bluetooth, IEEE 802.11, and local Ethernet segment.",
    },
    L: {
      name: 'Local',
      description:
        "<b>Bad:</b> A vulnerability exploitable with local access means the vulnerable authorization scope is not bound to the network stack and the attacker's path to the vulnerable authorization scope is via read / write / execute capabilities. If the attacker has the necessary Privileges Required to interact with the vulnerable authorization scope, they may be logged in locally; otherwise, they may deliver an exploit to a user and rely on User Interaction",
    },
    P: {
      name: 'Physical',
      description:
        '<b>Bad:</b> A vulnerability exploitable with physical access requires the ability to physically touch or manipulate a vulnerable authorization scope. Physical interaction may be brief (evil maid attack) or persistent.',
    },
  },
  AC: {
    L: {
      name: 'Low',
      description:
        '<b>Worst:</b> Specialized access conditions or extenuating circumstances do not exist. An attacker can expect repeatable exploit success against a vulnerable target.',
    },
    H: {
      name: 'High',
      description:
        "<b>Bad:</b> A successful attack depends on conditions outside the attacker's control. That is, a successful attack cannot be accomplished at-will, but requires the attacker to invest in some measurable amount of effort in preparation or execution against a specific target before successful attack can be expected. A successful attack depends on attackers overcoming one OR both of the following conditions: the attacker must gather target-specific reconnaissance; or the attacker must prepare the target environment to improve exploit reliability.",
    },
  },
  PR: {
    N: {
      name: 'None',
      description:
        '<b>Worst:</b> The attacker is unprivileged or unauthenticated.',
    },
    L: {
      name: 'Low',
      description:
        '<b>Worse</b> The attacker is authenticated with privileges that provide basic, low-impact capabilities. With these starting privileges an attacker is able to cause a Partial impact to one or more of: Confidentiality, Integrity, or Availability. Alternatively, an attacker with Low privileges may have the ability to cause an impact only to non-sensitive resources.',
    },
    H: {
      name: 'High',
      description:
        '<b>Bad:</b> The attacker is authenticated with privileges that provide significant control over component resources. With these starting privileges an attacker can cause a Complete impact to one or more of: Confidentiality, Integrity, or Availability. Alternatively, an attacker with High privileges may have the ability to cause a Partial impact to sensitive resources.',
    },
  },
  UI: {
    N: {
      name: 'None',
      description:
        '<b>Worst:</b> The vulnerable system can be exploited without any interaction from any user.',
    },
    R: {
      name: 'Required',
      description:
        '<b>Bad:</b> Successful exploitation of this vulnerability requires a user to take one or more actions that may or may not be expected in a scenario involving no exploitation, or a scenario involving content provided by a seemingly trustworthy source.',
    },
  },
  S: {
    C: {
      name: 'Changed',
      description:
        '<b>Worst:</b> The attacker attacks the vulnerable authorization scope and has an impact to its environment. This causes a direct impact to another scope. Score Impact relative to the Changed Scope.',
    },
    U: {
      name: 'Unchanged',
      description:
        '<b>Bad:</b> The attacker attacks and impacts the environment that authorizes actions taken by the vulnerable authorization scope. Score Impact relative to the original authorization authority.',
    },
  },
  C: {
    H: {
      name: 'High',
      description:
        "<b>Worst:</b> There is total information disclosure, resulting in all resources in the affected scope being divulged to the attacker. Alternatively, access to only some restricted information is obtained, but the disclosed information presents a direct, serious impact to the affected scope (e.g. the attacker can read the administrator's password, or private keys in memory are disclosed to the attacker).",
    },
    L: {
      name: 'Low',
      description:
        '<b>Bad:</b> There is informational disclosure or a bypass of access controls. Access to some restricted information is obtained, but the attacker does not have control over what is obtained, or the scope of the loss is constrained. The information disclosure does not have a direct, serious impact on the affected scope.',
    },
    N: {
      name: 'None',
      description:
        '<b>Good:</b> There is no impact to confidentiality within the affected scope.',
    },
  },
  I: {
    H: {
      name: 'High',
      description:
        '<b>Worst:</b> There is a total compromise of system integrity. There is a complete loss of system protection, resulting in the entire system being compromised. The attacker is able to modify any files on the target system.',
    },
    L: {
      name: 'Low',
      description:
        '<b>Bad:</b> Modification of data is possible, but the attacker does not have control over the end result of a modification, or the scope of modification is constrained. The data modification does not have a direct, serious impact on the affected scope.',
    },
    N: {
      name: 'None',
      description:
        '<b>Good:</b> There is no impact to integrity within the affected scope.',
    },
  },
  A: {
    H: {
      name: 'High',
      description:
        '<b>Worst:</b> There is total loss of availability, resulting in the attacker being able to fully deny access to resources in the affected scope; this loss is either sustained (while the attacker continues to deliver the attack) or persistent (the condition persists even after the attack has completed). Alternatively, the attacker has the ability to deny some availability, but the loss of availability presents a direct, serious impact to the affected scope (e.g. the attacker cannot disrupt existing connections, but can prevent new connections; the attacker can repeatedly exploit a vulnerability that, in each instance of a successful attack, leaks a only small amount of memory, but after repeated exploitation causes a service to become completely unavailable).',
    },
    L: {
      name: 'Low',
      description:
        '<b>Bad:</b> There is reduced performance or interruptions in resource availability. The attacker does not have the ability to completely deny service to legitimate users, even through repeated exploitation of the vulnerability. The resources in the affected scope are either partially available all of the time, or fully available only some of the time, but the overall there is no direct, serious impact to the affected scope.',
    },
    N: {
      name: 'None',
      description:
        '<b>Good:</b> There is no impact to availability within the affected scope.',
    },
  },
};

const severityRatings = [
  {
    name: 'Low',
    bottom: 0.0,
    top: 3.9,
  },
  {
    name: 'Medium',
    bottom: 4.0,
    top: 6.9,
  },
  {
    name: 'High',
    bottom: 7.0,
    top: 10.0,
  },
];

const calculate = (values) => {
  try {
    var exploitabilityCoefficient = 8.22;
    var scopeCoefficient = 1.08;

    // Define associative arrays mapping each metric value to the constant used in the CVSS scoring formula.
    var Weight = {
      AV: {
        N: 0.85,
        A: 0.62,
        L: 0.55,
        P: 0.2,
      },
      AC: {
        H: 0.44,
        L: 0.77,
      },
      PR: {
        U: {
          N: 0.85,
          L: 0.62,
          H: 0.27,
        },
        // These values are used if Scope is Unchanged
        C: {
          N: 0.85,
          L: 0.68,
          H: 0.5,
        },
      },
      // These values are used if Scope is Changed
      UI: {
        N: 0.85,
        R: 0.62,
      },
      S: {
        U: 6.42,
        C: 7.52,
      },
      C: {
        N: 0,
        L: 0.22,
        H: 0.56,
      },
      I: {
        N: 0,
        L: 0.22,
        H: 0.56,
      },
      A: {
        N: 0,
        L: 0.22,
        H: 0.56,
      },
      // C, I and A have the same weights
    };

    var p;
    var val = {};
    var metricWeight = {};

    for (p in baseGroup) {
      val[p] = values[p];

      if (typeof val[p] === 'undefined' || val[p] === null) {
        return '?';
      }

      metricWeight[p] = Weight[p][val[p]];
    }

    metricWeight.PR = Weight.PR[val.S][val.PR];

    var baseScore;
    var impactSubScore;
    var exploitabalitySubScore =
      exploitabilityCoefficient *
      metricWeight.AV *
      metricWeight.AC *
      metricWeight.PR *
      metricWeight.UI;

    var impactSubScoreMultiplier =
      1 - (1 - metricWeight.C) * (1 - metricWeight.I) * (1 - metricWeight.A);

    if (val.S === 'U') {
      impactSubScore = metricWeight.S * impactSubScoreMultiplier;
    } else {
      impactSubScore =
        metricWeight.S * (impactSubScoreMultiplier - 0.029) -
        3.25 * Math.pow(impactSubScoreMultiplier - 0.02, 15);
    }

    if (impactSubScore <= 0) {
      baseScore = 0;
    } else {
      if (val.S === 'U') {
        baseScore = Math.min(exploitabalitySubScore + impactSubScore, 10);
      } else {
        baseScore = Math.min(
          (exploitabalitySubScore + impactSubScore) * scopeCoefficient,
          10
        );
      }
    }

    baseScore = Math.ceil(baseScore * 10) / 10;

    return baseScore;
  } catch (err) {
    console.log(err);
    return err;
  }
};

const getSeverityRating = (score) => {
  for (let i = 0; i < severityRatings.length; i++) {
    if (score >= severityRatings[i].bottom && score <= severityRatings[i].top) {
      return severityRatings[i];
    }
  }
};

export default function Calculator() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [values, setValues] = useState({
    AV: 'N',
    AC: 'H',
    PR: 'N',
    UI: 'N',
    S: 'C',
    C: 'H',
    I: 'H',
    A: 'H',
  });

  const baseScore = calculate(values);

  return (
    <ProtectedRoute>
      <Sidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        activeLink={6}
      />

      <div className="flex flex-1 flex-col md:pl-64 bg-gray-100">
        <div className="sticky top-0 z-10 bg-gray-100 pl-1 pt-1 sm:pl-3 sm:pt-3 md:hidden">
          <button
            type="button"
            className="-ml-0.5 -mt-0.5 inline-flex h-12 w-12 items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <Bars3Icon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>

        <main className="flex-1">
          <div className="py-8 min-h-screen">
            <div className="mx-auto px-4 sm:px-6 md:px-8">
              {/* Replace with your content */}
              <div className="w-3/4 mx-auto">
                <div className="flex justify-between">
                  <div className="text-lg font-medium mb-4">
                    CVSS Base Score Calculator
                  </div>
                  <div className="mb-4">
                    Base Score:{' '}
                    <SeverityRating rating={getSeverityRating(baseScore)?.name}>
                      <b>{baseScore}</b>
                    </SeverityRating>
                  </div>
                </div>
                {Object.keys(baseGroup).map((group) => {
                  return (
                    <List
                      key={group}
                      group={group}
                      groupName={baseGroup[group]}
                      options={baseMetrics[group]}
                      values={values}
                      setValues={setValues}
                    />
                  );
                })}
              </div>

              {/* /End replace */}
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
